export function createAppRepository(env) {
  return {
    async storageStatus() {
      return env.DB ? 'configured' : 'not-configured';
    }
  };
}
