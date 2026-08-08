import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    hookTimeout: 300_000, // beforeAll/afterAll: deploy + crearProceso puede tardar
    testTimeout: 180_000, // cada it(): cada tx real genera una prueba ZK
  },
});