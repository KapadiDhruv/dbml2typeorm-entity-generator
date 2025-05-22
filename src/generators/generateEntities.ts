import { execSync } from 'child_process';
import { patchSchemaInEntities, renameEntitiesToEntitySuffix } from '../utils/fileUtils';
import { MAX_GENERATOR_ATTEMPTS, RETRY_DELAY_MS, ENTITY_FOLDER, SCHEMA_NAME, TARGET_SCHEMA_NAME } from '../constants';

export async function generateEntities() {
  let attempt = 0;
  while (attempt < MAX_GENERATOR_ATTEMPTS) {
    try {
      console.log(`🚀 Generating entities (attempt ${attempt + 1})`);
      execSync('npx typeorm-model-generator -c', { stdio: 'inherit' });

      if (!require('fs').existsSync(ENTITY_FOLDER)) {
        throw new Error('Entity folder not found');
      }

      patchSchemaInEntities(ENTITY_FOLDER, SCHEMA_NAME, TARGET_SCHEMA_NAME);
      renameEntitiesToEntitySuffix(ENTITY_FOLDER);

      return;
    } catch (err: any) {
      if (err.message?.includes('Tables not found')) {
        attempt++;
        await new Promise(r => setTimeout(r, RETRY_DELAY_MS));
      } else {
        throw err;
      }
    }
  }

  console.error('❌ Failed to generate entities after multiple attempts');
  process.exit(1);
}
