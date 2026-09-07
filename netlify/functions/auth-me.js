import vercelHandler from '../../api/auth/me.js';
import { runVercelHandler } from './_adapter.js';

export async function handler(event) {
  return runVercelHandler(vercelHandler, event);
}
