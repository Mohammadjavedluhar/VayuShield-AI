import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      reportsDirectory: './coverage',
      include: ['src/domain/**', 'api/**'],
      exclude: [
        'src/test/**',
        'tests/**',
        'node_modules/**',
        'dist/**',
        'src/domain/types.ts',
      ],
    },
  },
});
