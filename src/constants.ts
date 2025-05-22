import path from 'path';

export const SCHEMA_NAME = 'public_test';
export const TARGET_SCHEMA_NAME = 'public';
export const OUTPUT_FOLDER_NAME = process.env.OUTPUT_PATH || 'output';
export const ENTITY_FOLDER = path.resolve(__dirname, `../${OUTPUT_FOLDER_NAME}/entities`);
export const ENUM_FILE_PATH = path.resolve(__dirname, `../${OUTPUT_FOLDER_NAME}/enum.ts`);
export const MAX_GENERATOR_ATTEMPTS = 5;
export const RETRY_DELAY_MS = 2000;
