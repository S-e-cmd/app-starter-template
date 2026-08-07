let activeModal = null;

export function openModal({ title = '', content = '', onClose } = {}) {
  closeModal();

  const backdrop = document.createElement('div');
  backdrop.className = 'app-modal-backdrop';
  backdrop.innerHTML = `
    <section class="app-modal" role="dialog" aria-modal="true" aria-label="${escapeHtml(title)}">
      <header class="app-modal-header">
        <h2></h2>
        <button type="button" class="app-modal-close" aria-label="閉じる">×</button>
      </header>
      <div class="app-modal-body"></div>
    </section>
  `;

  backdrop.querySelector('h2').textContent = title;
  const body = backdrop.querySelector('.app-modal-body');
  if (content instanceof Node) body.appendChild(content);
  else body.textContent = String(content ?? '');

  const close = () => {
    backdrop.remove();
    activeModal = null;
    onClose?.();
  };

  backdrop.querySelector('.app-modal-close').addEventListener('click', close);
  backdrop.addEventListener('click', (event) => {
    if (event.target === backdrop) close();
  });

  document.body.appendChild(backdrop);
  activeModal = { close };
  return activeModal;
}

export function closeModal() {
  activeModal?.close();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  })[char]);
}
