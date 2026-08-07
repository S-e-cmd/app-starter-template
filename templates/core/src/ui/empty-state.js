export function renderEmptyState(container, message = '表示するデータがありません。') {
  container.replaceChildren();
  const element = document.createElement('p');
  element.className = 'app-empty-state';
  element.textContent = message;
  container.appendChild(element);
}
