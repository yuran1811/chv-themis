-- sqlite3 ../chv-themis.db < ../importAccounts.sql

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    hashed_password BLOB,
    salt BLOB
);

INSERT INTO users (username, password)
SELECT 
    json_extract(value, '$.username'), 
    json_extract(value, '$.password')
FROM json_each(readfile('accounts.json'));

-- If the initial JSON file is newline separated JSON elements, convert it using jq:
-- jq -s <my_data_raw.json >my_data.json