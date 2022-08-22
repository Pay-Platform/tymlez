const { env } = process;

export function restoreEnv() {
  process.env = env;
}

export function mockEnv(overrides: Record<string, string> = {}) {
  process.env = {
    ...env,
    ...overrides,
  };
}
