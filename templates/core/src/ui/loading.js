let overlay;

export function setLoading(active, message = '処理中…') {
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'app-loading-overlay';
    overlay.hidden = true;
    overlay.innerHTML = '<div class="app-loading-panel"><span class="app-loading-spinner" aria-hidden="true"></span><p></p></div>';
    document.body.appendChild(overlay);
  }

  overlay.querySelector('p').textContent = message;
  overlay.hidden = !active;
  document.documentElement.toggleAttribute('data-app-busy', active);
}
