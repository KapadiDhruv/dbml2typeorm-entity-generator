import { Client } from 'pg';
import { SCHEMA_NAME } from '../constants';

export async function prepareSchema(client: Client, sql: string) {
  await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
  await client.query(`DROP SCHEMA IF EXISTS "${SCHEMA_NAME}" CASCADE`);
  await client.query(`CREATE SCHEMA "${SCHEMA_NAME}"`);
  await client.query(`SET search_path TO ${SCHEMA_NAME}, public;`);
  await client.query(sql);
  console.log(`✅ SQL executed in schema "${SCHEMA_NAME}"`);
}
