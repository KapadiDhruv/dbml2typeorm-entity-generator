import { execSync } from 'child_process';

export function convertDbmlToSql(inputPath: string, outputPath: string) {
  try {
    console.log('⏳ Converting DBML to SQL...');
    const command = `dbml2sql --language postgresql "${inputPath}" -o "${outputPath}"`;
    execSync(command, { stdio: 'inherit' });
    console.log('✅ SQL file generated');
  } catch (e: any) {
    console.error('❌ DBML to SQL conversion failed:', e.message || e);
    process.exit(1);
  }
}
