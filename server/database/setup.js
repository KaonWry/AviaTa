import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const runSqlFile = async (connection, filePath) => {
  try {
    const sql = fs.readFileSync(filePath, 'utf8');
    const statements = sql
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);

    for (const statement of statements) {
      await connection.query(statement);
    }
    console.log(`Successfully executed ${path.basename(filePath)}`);
  } catch (error) {
    console.error(`Error executing ${path.basename(filePath)}:`, error);
    throw error;
  }
};

const setupDatabase = async () => {
  console.log('Starting database setup...');
  
  let connection;
  try {
    // Connect without database selected first
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'admin',
      password: process.env.DB_PASSWORD || 'admin',
    });

    console.log('Connected to MySQL server.');

    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME || 'aviata_db';
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    console.log(`Database '${dbName}' created or already exists.`);

    // Use the database
    await connection.query(`USE \`${dbName}\`;`);

    // Run Schema
    await runSqlFile(connection, path.join(__dirname, 'schema.sql'));
    
    // Run Seed
    await runSqlFile(connection, path.join(__dirname, 'seed.sql'));

    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Database setup failed:', error);
    if (error.code === 'ECONNREFUSED') {
      console.error('Make sure your MySQL server is running (e.g., XAMPP, WAMP, or Docker).');
    }
  } finally {
    if (connection) await connection.end();
  }
};

setupDatabase();
