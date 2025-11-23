export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', (html) => {
    // Inject critical styles at the very beginning of head
    const criticalStyles = `
      <style>
        html, body { background-color: #030712 !important; margin: 0; padding: 0; }
        #static-loader { position: fixed; inset: 0; z-index: 99999; display: flex; align-items: center; justify-content: center; background-color: #030712; }
        #static-loader.fade-out { opacity: 0; transition: opacity 0.3s ease-out; pointer-events: none; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      </style>
    `;
    html.head.unshift(criticalStyles);

    // Inject static loader at the beginning of body
    const staticLoader = `
      <div id="static-loader" style="position: fixed; inset: 0; z-index: 99999; display: flex; align-items: center; justify-content: center; background-color: #030712;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">
          <div style="position: relative; width: 4rem; height: 4rem;">
            <div style="position: absolute; inset: 0; border-radius: 9999px; border: 4px solid rgba(16, 185, 129, 0.3);"></div>
            <div style="position: absolute; inset: 0; border-radius: 9999px; border: 4px solid transparent; border-top-color: #10b981; animation: spin 1s linear infinite;"></div>
          </div>
          <p style="color: #34d399; font-size: 0.875rem; font-weight: 500; margin: 0; animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;">Loading...</p>
        </div>
      </div>
    `;
    html.body.unshift(staticLoader);

    // Add inline style to html element for immediate dark background
    html.htmlAttrs.push('style="background-color: #030712;"');
    html.bodyAttrs.push('style="background-color: #030712; margin: 0;"');
  });
});
