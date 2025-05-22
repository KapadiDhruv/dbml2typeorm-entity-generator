import fs from 'fs';
import path from 'path';
import { ENTITY_FOLDER, ENUM_FILE_PATH } from '../constants';

export async function replaceInlineEnums() {
  const enums = parseEnumFile();
  const files = fs.readdirSync(ENTITY_FOLDER).filter(f => f.endsWith('.ts'));

  files.forEach(file => {
    const filePath = path.join(ENTITY_FOLDER, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    let modified = false;
    const imports = new Set<string>();

    const enumColumnRegex =
      /@Column\("enum",\s*\{([^}]*?)enum:\s*\[([^\]]+)\]([^}]*)\}\)\s+(\w+): ([^;]+);/g;

    const newContent = content.replace(enumColumnRegex, (match, beforeEnum, enumArray, afterEnum, prop, type) => {
      const values = enumArray.split(',').map((v: any) => v.trim().replace(/['"]/g, ''));
      const matched = findEnum(values, enums);
      if (!matched) return match;
      imports.add(matched);
      modified = true;

      const parts = [beforeEnum.trim(), `enum: ${matched}`, afterEnum.trim()].filter(Boolean);
      return `@Column("enum", { ${parts.join(', ')} })\n  ${prop}: ${matched};`;
    });

    if (modified) {
      const importLine = `import { ${[...imports].join(', ')} } from "../enum";\n`;
      const finalContent = insertImport(newContent, importLine);
      fs.writeFileSync(filePath, finalContent, 'utf-8');
      console.log(`✅ Updated enums in ${file}`);
    }
  });
}

function insertImport(content: string, importLine: string): string {
  const lastImport = content.lastIndexOf('import');
  const endOfLastImport = content.indexOf('\n', lastImport) + 1;
  return content.slice(0, endOfLastImport) + importLine + content.slice(endOfLastImport);
}

function parseEnumFile() {
  const content = fs.readFileSync(ENUM_FILE_PATH, 'utf-8');
  const enums: Record<string, string[]> = {};

  const regex = /export enum (\w+)\s*{([^}]+)}/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const [, name, body] = match;
    const values = Array.from(body.matchAll(/=\s*['"]([^'"]+)['"]/g)).map(m => m[1]);
    enums[name] = values;
  }

  return enums;
}

function findEnum(values: string[], enums: Record<string, string[]>): string | null {
  for (const [name, enumVals] of Object.entries(enums)) {
    if (values.length === enumVals.length && values.every(v => enumVals.includes(v))) {
      return name;
    }
  }
  return null;
}
