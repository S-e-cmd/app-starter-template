import { showToast } from './toast.js';

export function reportError(error, userMessage = '処理に失敗しました') {
  console.error(error);
  showToast(userMessage, { type: 'error', durationMs: 5000 });
}
