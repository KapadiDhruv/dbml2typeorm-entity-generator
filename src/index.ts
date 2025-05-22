#!/usr/bin/env node
import { convertDbmlToSql } from './generators/dbmlToSql';
import { extractEnumsFromSql } from './generators/extractEnums';
import { prepareSchema } from './db/prepareSchema';
import { generateEntities as generateTypeormEntities } from './generators/generateEntities';
import { connectToDatabase } from './db/connect';
import { replaceInlineEnums } from './generators/replaceInlineEnums';
import { patchSqlDefaults } from './utils/patchSqlDefaults';
import { writeTomgConfig } from './config/tomgConfig';
import { findDbmlFile } from './utils/findDbmlFile';

import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

export async function generateEntities(dbmlFilePath?: string) {
  writeTomgConfig();

  if (!dbmlFilePath) {
    dbmlFilePath = process.env.SCHEMA_DBML_PATH || findDbmlFile(process.cwd());
  }

  if (!dbmlFilePath || !fs.existsSync(dbmlFilePath)) {
    throw new Error('DBML file path not provided or file does not exist.');
  }

  const sqlFilePath = dbmlFilePath.replace('.dbml', '.sql');

  convertDbmlToSql(dbmlFilePath, sqlFilePath);

  const client = await connectToDatabase();

  try {
    let rawSql = fs.readFileSync(sqlFilePath, 'utf8');
    rawSql = patchSqlDefaults(rawSql);
    const patchedSql = extractEnumsFromSql(rawSql);

    await prepareSchema(client, patchedSql);

    await generateTypeormEntities();

    await replaceInlineEnums();

    console.log('✅ Pipeline complete!');
  } catch (err) {
    console.error('❌ Error in generation pipeline:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

if (require.main === module) {
  generateEntities().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}
