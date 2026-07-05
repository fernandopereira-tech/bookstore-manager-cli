import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const { Pool } = pg;
export const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
});
export async function testConnection() {
    try {
        const client = await pool.connect();
        client.release();
        return true;
    }
    catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
        return false;
    }
}
//# sourceMappingURL=connection.js.map