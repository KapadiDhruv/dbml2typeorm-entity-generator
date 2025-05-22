export function patchSqlDefaults(sql: string): string {
  // Replace DEFAULT 'uuid_generate_v4()' with DEFAULT uuid_generate_v4()
  return sql.replace(/DEFAULT\s+'(uuid_generate_v4\(\))'/g, 'DEFAULT uuid_generate_v4()')
            .replace(/DEFAULT\s+'(gen_random_uuid\(\))'/g, 'DEFAULT gen_random_uuid()')
            .replace(/DEFAULT\s+'(CURRENT_TIMESTAMP)'/g, 'DEFAULT CURRENT_TIMESTAMP')
            .replace(/DEFAULT\s+'(NOW\(\))'/g, 'DEFAULT NOW()')
            .replace(/DEFAULT\s+'(CURRENT_DATE)'/g, 'DEFAULT CURRENT_DATE')
            .replace(/DEFAULT\s+'(CURRENT_TIME)'/g, 'DEFAULT CURRENT_TIME')
            .replace(/DEFAULT\s+'(LOCALTIMESTAMP)'/g, 'DEFAULT LOCALTIMESTAMP')
            .replace(/DEFAULT\s+'(LOCALTIME)'/g, 'DEFAULT LOCALTIME')
            .replace(/DEFAULT\s+'(statement_timestamp\(\))'/g, 'DEFAULT statement_timestamp()')
            .replace(/DEFAULT\s+'(transaction_timestamp\(\))'/g, 'DEFAULT transaction_timestamp()')
            .replace(/DEFAULT\s+'(clock_timestamp\(\))'/g, 'DEFAULT clock_timestamp()');
}