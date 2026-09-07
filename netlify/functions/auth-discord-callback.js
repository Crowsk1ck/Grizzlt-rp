import vercelHandler from '../../api/auth/discord/callback.js';
import { runVercelHandler } from './_adapter.js';

export async function handler(event) {
  return runVercelHandler(vercelHandler, event);
}
