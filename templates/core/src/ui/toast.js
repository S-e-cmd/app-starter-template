let container;

function ensureContainer() {
  if (container) return container;
  container = document.createElement('div');
  container.id = 'app-toast-container';
  container.setAttribute('aria-live', 'polite');
  document.body.appendChild(container);
  return container;
}

export function showToast(message, { type = 'info', durationMs = 3000 } = {}) {
  const host = ensureContainer();
  const toast = document.createElement('div');
  toast.className = `app-toast app-toast-${type}`;
  toast.textContent = message;
  host.appendChild(toast);
  window.setTimeout(() => toast.remove(), durationMs);
}
