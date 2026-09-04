/**
 * FLUENT - Flame + Voice Logo Component
 * Renders an elegant SVG flame icon with subtle speech soundwaves integrated into the inner flame.
 */
const FluentLogo = {
  getSvgHTML(size = 32, color = '#0d9488') {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Outer Flame Outline -->
        <path d="M16 2C16 2 9 8.5 9 17.5C9 22.1944 12.134 26 16 26C19.866 26 23 22.1944 23 17.5C23 11 18.5 7.5 16 2Z" 
              fill="${color}" fill-opacity="0.15" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        
        <!-- Inner Flame Voice Core -->
        <path d="M16 10C16 10 13.5 13.5 13.5 17C13.5 19.2091 14.6193 21 16 21C17.3807 21 18.5 19.2091 18.5 17C18.5 14 16.5 12 16 10Z" 
              fill="${color}"/>
        
        <!-- Subtle Speech / Voice Wave Lines inside inner flame -->
        <path d="M15 16H17M14.5 18H17.5" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    `;
  },

  renderInto(elementId, size = 32, color = '#0d9488') {
    const el = document.getElementById(elementId);
    if (el) {
      el.innerHTML = this.getSvgHTML(size, color);
    }
  }
};
window.FluentLogo = FluentLogo;
