import vercelHandler from '../../api/admin/members.js';
import { runVercelHandler } from './_adapter.js';

export async function handler(event) {
  return runVercelHandler(vercelHandler, event);
}
