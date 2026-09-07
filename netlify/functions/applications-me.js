import vercelHandler from '../../api/applications/me.js';
import { runVercelHandler } from './_adapter.js';

export async function handler(event) {
  return runVercelHandler(vercelHandler, event);
}
