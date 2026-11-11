function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Environment variable ${name} is not set. Copy .env.example to .env and fill in the Wikipedia credentials.`,
    );
  }
  return value;
}

/**
 * Credentials are read lazily, so commands that do not need them
 * (e.g. `playwright test --list`) work without a .env file.
 */
export const credentials = {
  get username(): string {
    return requireEnv('WIKI_USERNAME');
  },
  get password(): string {
    return requireEnv('WIKI_PASSWORD');
  },
};
