const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Required for cloud providers like Neon/Render
    }
});

pool.connect()
    .then(() => console.log('🟢 [DATABASE] PostgreSQL bridge is active.'))
    .catch(err => console.error('🔴 [DATABASE] Connection failed!', err.stack));

module.exports = pool;
module.exports = {
    query: (text, params) => pool.query(text, params),
};