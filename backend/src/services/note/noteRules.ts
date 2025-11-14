/**
 * @summary
 * Business logic for note operations
 *
 * @module services/note/noteRules
 *
 * @description
 * Implements business rules and database operations for note management
 */

import { NoteCreateRequest, NoteCreateResponse } from './noteTypes';
import { dbRequest, ExpectedReturn } from '@/utils/database';

/**
 * @summary
 * Creates a new note in the database
 *
 * @function noteCreate
 *
 * @param {NoteCreateRequest} params - Note creation parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idUser - User identifier
 * @param {string} params.title - Note title
 * @param {string} params.content - Note content
 *
 * @returns {Promise<NoteCreateResponse>} Created note identifier
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {BusinessRuleError} When business rules are violated
 * @throws {DatabaseError} When database operation fails
 *
 * @example
 * const note = await noteCreate({
 *   idAccount: 1,
 *   idUser: 123,
 *   title: 'My First Note',
 *   content: 'This is the content of my note'
 * });
 */
export async function noteCreate(params: NoteCreateRequest): Promise<NoteCreateResponse> {
  const result = await dbRequest('[functional].[spNoteCreate]', params, ExpectedReturn.Single);

  return result;
}
