import { createAppState } from './state.js';
import { setLoading } from '../ui/loading.js';

export async function bootstrap() {
  const state = createAppState();
  setLoading(true, '初期化中…');
  try {
    state.ready = true;
  } finally {
    setLoading(false);
  }
}
