import path from 'node:path';

/** Browser storage state (cookies) of the logged-in user, produced by tests/auth.setup.ts. */
export const STORAGE_STATE_PATH = path.resolve(__dirname, '../../playwright/.auth/user.json');
