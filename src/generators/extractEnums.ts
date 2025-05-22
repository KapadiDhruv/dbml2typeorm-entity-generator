import fs from 'fs';
import { ENUM_FILE_PATH } from '../constants';
import { toPascalCase, toEnumKey } from '../utils/stringUtils';

export function extractEnumsFromSql(sql: string): string {
  const enumRegex = /CREATE\s+TYPE\s+"?(\w+)"?\s+AS\s+ENUM\s*\(([^)]+)\)/gi;
  const enums: string[] = [];

  let match;
  while ((match = enumRegex.exec(sql)) !== null) {
    const [_, enumName, valuesRaw] = match;
    const values = valuesRaw.split(',')
      .map(v => v.trim().replace(/^'(.*)'$/, '$1'))
      .filter(Boolean);

    const tsEnum = `export enum ${toPascalCase(enumName)} {\n` +
      values.map(val => `  ${toEnumKey(val)} = '${val}',`).join('\n') +
      `\n}\n`;

    enums.push(tsEnum);
  }

  if (enums.length > 0) {
    fs.mkdirSync(require('path').dirname(ENUM_FILE_PATH), { recursive: true });
    fs.writeFileSync(ENUM_FILE_PATH, enums.join('\n'), 'utf-8');
    console.log(`✅ enum.ts generated with ${enums.length} enums`);
  }

  return sql;
}
