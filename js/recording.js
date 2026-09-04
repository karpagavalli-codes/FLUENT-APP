/**
 * FLUENT - Audio/Video MediaRecorder & WebSpeechRecognition Manager
 */
const FluentRecorder = {
  mediaStream: null,
  mediaRecorder: null,
  recognition: null,
  audioContext: null,
  analyser: null,
  animFrameId: null,
  
  isRecording: false,
  isPaused: false,
  mode: 'audio', // 'audio' or 'video'
  
  secondsElapsed: 0,
  timerInterval: null,
  transcript: '',
  
  onTimerTick: null,
  onTranscriptUpdate: null,

  async startRecording(mode = 'audio', videoElementId = null, canvasId = null) {
    this.mode = mode;
    this.transcript = '';
    this.secondsElapsed = 0;
    this.isRecording = true;
    this.isPaused = false;

    // 1. Setup Media Stream
    try {
      const constraints = mode === 'video' 
        ? { audio: true, video: { width: 1280, height: 720 } }
        : { audio: true, video: false };

      this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints);

      // If video mode, bind stream to video element
      if (mode === 'video' && videoElementId) {
        const videoEl = document.getElementById(videoElementId);
        if (videoEl) {
          videoEl.srcObject = this.mediaStream;
          videoEl.play();
        }
      }

      // If audio visualizer canvas present
      if (canvasId) {
        this.setupAudioVisualizer(canvasId);
      }

      // Setup MediaRecorder for audio/video blob capture
      this.mediaRecorder = new MediaRecorder(this.mediaStream);
      this.mediaRecorder.start(1000);

    } catch (err) {
      console.warn("Microphone/Camera access notice: ", err);
      // Allow user practice even if hardware mic is restricted in sandbox
    }

    // 2. Setup Speech Recognition Stream (WebSpeech API)
    this.setupSpeechRecognition();

    // 3. Start Timer
    this.timerInterval = setInterval(() => {
      if (!this.isPaused) {
        this.secondsElapsed++;
        if (this.onTimerTick) {
          this.onTimerTick(this.secondsElapsed, this.getFormattedTime());
        }
      }
    }, 1000);
  },

  setupSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript + ' ';
        }
        this.transcript = currentTranscript.trim();
        if (this.onTranscriptUpdate) {
          this.onTranscriptUpdate(this.transcript);
        }
      };

      this.recognition.onerror = (e) => {
        console.log("Speech recognition status: ", e.error);
      };

      try {
        this.recognition.start();
      } catch (e) {}
    }
  },

  setupAudioVisualizer(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !this.mediaStream) return;

    const ctx = canvas.getContext('2d');
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = this.audioContext.createMediaStreamSource(this.mediaStream);
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 64;
    source.connect(this.analyser);

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!this.isRecording) return;
      this.animFrameId = requestAnimationFrame(draw);

      this.analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 1.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height * 0.8;
        ctx.fillStyle = '#0d9488';
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);
        x += barWidth;
      }
    };

    draw();
  },

  pauseRecording() {
    this.isPaused = true;
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.pause();
    }
  },

  resumeRecording() {
    this.isPaused = false;
    if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume();
    }
  },

  async stopRecording() {
    this.isRecording = false;
    this.isPaused = false;

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    if (this.recognition) {
      try { this.recognition.stop(); } catch (e) {}
    }

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
    }

    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }

    if (this.audioContext) {
      try { await this.audioContext.close(); } catch (e) {}
    }

    return {
      durationSeconds: this.secondsElapsed,
      formattedTime: this.getFormattedTime(),
      transcript: this.transcript
    };
  },

  getFormattedTime() {
    const mins = Math.floor(this.secondsElapsed / 60);
    const secs = this.secondsElapsed % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
};
window.FluentRecording = FluentRecording;
