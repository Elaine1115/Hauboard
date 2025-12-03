export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', (html) => {
    // Script to detect theme preference before page renders (prevents flash)
    const themeScript = `
      <script>
        (function() {
          var theme = localStorage.getItem('theme');
          if (!theme) {
            theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          }
          document.documentElement.classList.add(theme);
          var isDark = theme === 'dark';
          document.documentElement.style.backgroundColor = isDark ? '#030712' : '#ffffff';
          if (document.body) {
            if (isDark) {
              document.body.style.backgroundColor = '#030712';
            } else {
              document.body.style.background = 'linear-gradient(135deg, #ecfdf5 0%, #ffffff 50%, #f0fdfa 100%)';
              document.body.style.backgroundAttachment = 'fixed';
            }
          }

          // Update loader colors based on theme
          var loader = document.getElementById('static-loader');
          if (loader) {
            loader.style.backgroundColor = isDark ? '#030712' : '#ffffff';
          }
        })();
      </script>
    `;

    // Inject critical styles at the very beginning of head
    const criticalStyles = `
      <style>
        html.dark, html.dark body { background-color: #030712 !important; color: #f9fafb; }
        html.light { background-color: #ffffff !important; }
        html.light body { background: linear-gradient(135deg, #ecfdf5 0%, #ffffff 50%, #f0fdfa 100%) !important; background-attachment: fixed !important; color: #111827; min-height: 100vh; }
        html:not(.dark):not(.light), html:not(.dark):not(.light) body { background-color: #030712 !important; }
        body { margin: 0; padding: 0; }
        #static-loader { position: fixed; inset: 0; z-index: 99999; display: flex; align-items: center; justify-content: center; }
        html.dark #static-loader { background-color: #030712; }
        html.light #static-loader { background-color: #ffffff; }
        html:not(.dark):not(.light) #static-loader { background-color: #030712; }
        #static-loader.fade-out { opacity: 0; transition: opacity 0.3s ease-out; pointer-events: none; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        html.dark #static-loader .loader-text { color: #34d399; }
        html.light #static-loader .loader-text { color: #10b981; }
      </style>
    `;
    html.head.unshift(criticalStyles);
    html.head.unshift(themeScript);

    // Inject static loader at the beginning of body
    const staticLoader = `
      <div id="static-loader" style="position: fixed; inset: 0; z-index: 99999; display: flex; align-items: center; justify-content: center; background-color: #030712;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">
          <div style="position: relative; width: 4rem; height: 4rem;">
            <div style="position: absolute; inset: 0; border-radius: 9999px; border: 4px solid rgba(16, 185, 129, 0.3);"></div>
            <div style="position: absolute; inset: 0; border-radius: 9999px; border: 4px solid transparent; border-top-color: #10b981; animation: spin 1s linear infinite;"></div>
          </div>
          <p class="loader-text" style="color: #34d399; font-size: 0.875rem; font-weight: 500; margin: 0; animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;">Loading...</p>
        </div>
      </div>
    `;
    html.body.unshift(staticLoader);

    // Add default dark class to html (will be updated by script)
    html.htmlAttrs.push('class="dark"');
    html.htmlAttrs.push('style="background-color: #030712;"');
    html.bodyAttrs.push('style="background-color: #030712; margin: 0;"');
  });
});
