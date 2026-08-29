# FLUENT — Public Speaking & Communication Practice App

**FLUENT** is a clean, production-quality public speaking and technical explanation practice application designed for students and technology professionals to improve public speaking, technical articulation, vocabulary, answer structure, and interview confidence.

> **Central Philosophy:** The app gives the user the topic. The user researches, thinks, and speaks. AI analyzes the user's speaking and helps them improve.

---

## 🚀 Local Development

### Option A: Python Light Server (Zero-Dependency)
```bash
# Run server launcher with socket address reuse & port auto-probe
python server.py
```
Open [http://localhost:8080](http://localhost:8080) in your browser.

### Option B: Vite Dev Server (Node.js)
```bash
npm install
npm run dev
```

---

## 🛠️ Production Build

To test or build the production bundle:
```bash
npm run build
```
The optimized static production output will be generated in the `./dist` directory.

To preview the production build locally:
```bash
npm run preview
```

---

## 🌐 Production Deployment (GitHub Pages)

This repository includes an automated GitHub Actions deployment workflow located at `.github/workflows/deploy.yml`.

### Deployment Instructions:
1. Push your source code to the `main` branch of your GitHub repository:
   ```bash
   git add .
   git commit -m "Deploy FLUENT application"
   git push origin main
   ```
2. In your GitHub repository settings under **Pages**:
   - Set **Source** to **GitHub Actions**.
3. GitHub Actions will automatically install dependencies, build the production bundle, and deploy the app to your public HTTPS GitHub Pages URL:
   `https://<USERNAME>.github.io/<REPOSITORY_NAME>/`

---

## 📱 Mobile App Installation (PWA)

FLUENT is a fully functional Progressive Web App (PWA) and can be installed directly on iOS and Android devices without an app store:

### iOS (Safari):
1. Open the public HTTPS URL in Safari on your iPhone/iPad.
2. Tap the **Share** button (box with an upward arrow).
3. Scroll down and select **Add to Home Screen**.
4. Tap **Add**. FLUENT will launch as a standalone desktop app from your home screen.

### Android (Chrome / Edge):
1. Open the public HTTPS URL in Chrome or Edge on your phone.
2. Tap the **Three Dots Menu** in the top right corner.
3. Select **Install App** or **Add to Home Screen**.
4. Confirm installation. FLUENT will appear on your app drawer and home screen.

---

## 🔒 Microphones & Camera Permissions on HTTPS

Audio and video recording rely on standard Web API media drivers (`navigator.mediaDevices.getUserMedia`). Secure origin (`HTTPS` or `localhost`) is required by modern mobile browsers. When prompted on your phone, allow microphone and camera access.

---

## 📄 License
MIT License
