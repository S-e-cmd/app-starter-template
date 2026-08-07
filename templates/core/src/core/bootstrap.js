import { APP_CONFIG } from '../config/app-config.js';
import { createAppState } from './state.js';
import { setLoading } from '../ui/loading.js';

export async function bootstrap() {
  const state = createAppState();
  setLoading(true, '初期化中…');
  try {
    const buildElement = document.getElementById('app-build');
    if (buildElement) buildElement.textContent = APP_CONFIG.build;
    state.ready = true;
  } finally {
    setLoading(false);
  }
}
