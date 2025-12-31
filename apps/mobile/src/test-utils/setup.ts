// Global test setup (no React Native testing library)

global.beforeEach(() => {
  jest.clearAllMocks();
});

global.afterEach(() => {
  jest.restoreAllMocks();
});
