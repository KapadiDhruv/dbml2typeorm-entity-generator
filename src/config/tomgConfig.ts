import path from 'path';
import { OUTPUT_FOLDER_NAME, SCHEMA_NAME } from '../constants';

export function writeTomgConfig() {
  const config = [
    {
      resultsPath: path.resolve(__dirname, `../../${OUTPUT_FOLDER_NAME}`),
      pluralizeNames: true,
      noConfigs: false,
      convertCaseFile: 'param',
      convertCaseEntity: 'pascal',
      convertCaseProperty: 'camel',
      convertEol: 'LF',
      propertyVisibility: 'none',
      lazy: false,
      activeRecord: false,
      generateConstructor: false,
      customNamingStrategyPath: '',
      relationIds: false,
      strictMode: 'none',
      skipSchema: false,
      indexFile: false,
      exportType: 'named',
    },
    {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      databaseNames: [process.env.DB_NAME],
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      databaseType: 'postgres',
      schemaNames: [SCHEMA_NAME],
      ssl: false,
      skipTables: [],
      onlyTables: [],
    },
  ];

  const configPath = path.resolve(__dirname, '../../.tomg-config');
  require('fs').writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log(`✅ Config file written to ${configPath}`);
}
