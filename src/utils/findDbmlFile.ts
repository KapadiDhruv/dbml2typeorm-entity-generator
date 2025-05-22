import fs from 'fs';
import path from 'path';

export function findDbmlFile(startDir: string): string | undefined {
  const files = fs.readdirSync(startDir);
  
  for (const file of files) {
    const fullPath = path.join(startDir, file);
    const stat = fs.statSync(fullPath);

    // Skip node_modules
    if (stat.isDirectory()) {
      if (file === 'node_modules') continue;
      const found = findDbmlFile(fullPath);
      if (found) return found;
    } else if (file.endsWith('.dbml')) {
      return fullPath;
    }
  }

  return undefined;
}
