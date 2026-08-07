import { bootstrap } from './core/bootstrap.js';

bootstrap().catch((error) => {
  console.error('Application bootstrap failed', error);
});
