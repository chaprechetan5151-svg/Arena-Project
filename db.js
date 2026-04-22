const { Pool } = require('pg');

// 1. Initialize the PostgreSQL connection
const pool = new Pool({
    connectionString: "postgresql://neondb_owner:npg_6uWRT9NLGEZI@ep-wild-bird-an5y6lvq-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require",
    ssl: {
        rejectUnauthorized: false // Required for Neon cloud database
    }
});

// 2. Test the connection on boot
pool.connect()
    .then(() => console.log('🟢 [DATABASE] PostgreSQL bridge is active.'))
    .catch(err => console.error('🔴 [DATABASE] Connection failed!', err.stack));

// 3. Export for server.js to use
module.exports = {
    query: (text, params) => pool.query(text, params),
};