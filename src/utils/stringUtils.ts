export function toPascalCase(str: string) {
  return str.replace(/(^|_)(\w)/g, (_, __, c) => c.toUpperCase());
}

export function toEnumKey(value: string) {
  let key = value.replace(/[^a-zA-Z0-9_]/g, '_');
  if (/^[0-9]/.test(key)) key = '_' + key;
  return key.toUpperCase();
}
