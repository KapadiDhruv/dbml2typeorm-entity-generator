import fs from 'fs';
import path from 'path';

export function patchSchemaInEntities(dir: string, from: string, to: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (file.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const updated = content.replace(new RegExp(`schema:\\s*['"]${from}['"]`, 'g'), `schema: '${to}'`);
      fs.writeFileSync(fullPath, updated);
    }
  }
}

export function renameEntitiesToEntitySuffix(dir: string) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));
  for (const file of files) {
    if (!file.endsWith('.entity.ts')) {
      const oldPath = path.join(dir, file);
      const newPath = path.join(dir, file.replace('.ts', '.entity.ts'));
      fs.renameSync(oldPath, newPath);
      console.log(`Renamed ${file} → ${path.basename(newPath)}`);
    }
  }
}
