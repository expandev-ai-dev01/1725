/**
 * @summary
 * Database connection and query utilities
 *
 * @module utils/database
 *
 * @description
 * Provides database connection management and query execution utilities
 * for MS SQL Server operations
 */

import sql from 'mssql';
import { config } from '@/config';

/**
 * @enum ExpectedReturn
 * @description Defines expected return types from database operations
 */
export enum ExpectedReturn {
  Single = 'Single',
  Multi = 'Multi',
  None = 'None',
}

/**
 * @interface IRecordSet
 * @description Generic interface for database result sets
 */
export interface IRecordSet<T = any> {
  recordset: T[];
  rowsAffected: number[];
}

let pool: sql.ConnectionPool | null = null;

/**
 * @summary
 * Gets or creates database connection pool
 *
 * @function getPool
 *
 * @returns {Promise<sql.ConnectionPool>} Database connection pool
 *
 * @throws {Error} When connection fails
 */
export async function getPool(): Promise<sql.ConnectionPool> {
  if (!pool) {
    pool = await sql.connect({
      server: config.database.server,
      port: config.database.port,
      user: config.database.user,
      password: config.database.password,
      database: config.database.database,
      options: {
        encrypt: config.database.options.encrypt,
        trustServerCertificate: config.database.options.trustServerCertificate,
      },
    });
  }
  return pool;
}

/**
 * @summary
 * Executes a stored procedure with parameters
 *
 * @function dbRequest
 *
 * @param {string} procedure - Stored procedure name with schema
 * @param {object} parameters - Procedure parameters
 * @param {ExpectedReturn} expectedReturn - Expected return type
 * @param {sql.Transaction} transaction - Optional transaction context
 * @param {string[]} resultSetNames - Optional result set names for Multi return
 *
 * @returns {Promise<any>} Query results based on expectedReturn type
 *
 * @throws {Error} When query execution fails
 *
 * @example
 * const result = await dbRequest(
 *   '[functional].[spNoteCreate]',
 *   { idAccount: 1, idUser: 123, title: 'Note', content: 'Content' },
 *   ExpectedReturn.Single
 * );
 */
export async function dbRequest(
  procedure: string,
  parameters: any,
  expectedReturn: ExpectedReturn,
  transaction?: sql.Transaction,
  resultSetNames?: string[]
): Promise<any> {
  const pool = await getPool();
  const request = transaction ? new sql.Request(transaction) : pool.request();

  // Add parameters to request
  for (const [key, value] of Object.entries(parameters)) {
    request.input(key, value);
  }

  // Execute stored procedure
  const result = await request.execute(procedure);

  // Return based on expected type
  switch (expectedReturn) {
    case ExpectedReturn.Single:
      return result.recordset[0];

    case ExpectedReturn.Multi:
      if (resultSetNames && resultSetNames.length > 0) {
        const namedResults: { [key: string]: any } = {};
        resultSetNames.forEach((name, index) => {
          namedResults[name] = result.recordsets[index];
        });
        return namedResults;
      }
      return result.recordsets;

    case ExpectedReturn.None:
      return { rowsAffected: result.rowsAffected };

    default:
      return result.recordset;
  }
}

/**
 * @summary
 * Begins a new database transaction
 *
 * @function beginTransaction
 *
 * @returns {Promise<sql.Transaction>} Transaction object
 */
export async function beginTransaction(): Promise<sql.Transaction> {
  const pool = await getPool();
  const transaction = new sql.Transaction(pool);
  await transaction.begin();
  return transaction;
}

/**
 * @summary
 * Commits a database transaction
 *
 * @function commitTransaction
 *
 * @param {sql.Transaction} transaction - Transaction to commit
 *
 * @returns {Promise<void>}
 */
export async function commitTransaction(transaction: sql.Transaction): Promise<void> {
  await transaction.commit();
}

/**
 * @summary
 * Rolls back a database transaction
 *
 * @function rollbackTransaction
 *
 * @param {sql.Transaction} transaction - Transaction to rollback
 *
 * @returns {Promise<void>}
 */
export async function rollbackTransaction(transaction: sql.Transaction): Promise<void> {
  await transaction.rollback();
}
