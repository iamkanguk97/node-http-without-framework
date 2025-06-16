import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Get the directory name (__dirname method)
 * @returns {string}
 */
export const __dirname = () => {
  const __filename = fileURLToPath(import.meta.url);
  return path.dirname(__filename);
}