import vercelHandler from '../../api/members/profile.js';
import { runVercelHandler } from './_adapter.js';

export async function handler(event) {
  return runVercelHandler(vercelHandler, event);
}
