// Dentro de backend/server.js
const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: 'db', // <- MUDANÇA IMPORTANTE! Não é mais 'localhost'.
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: 5432,
});