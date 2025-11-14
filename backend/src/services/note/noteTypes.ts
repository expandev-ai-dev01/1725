/**
 * @summary
 * Type definitions for note service operations
 *
 * @module services/note/noteTypes
 */

/**
 * @interface NoteEntity
 * @description Represents a note entity in the system
 *
 * @property {number} idNote - Unique note identifier
 * @property {number} idAccount - Associated account identifier
 * @property {number} idUser - User who created the note
 * @property {string} title - Note title
 * @property {string} content - Note content
 * @property {Date} dateCreated - Creation timestamp
 * @property {Date} dateModified - Last modification timestamp
 * @property {boolean} deleted - Soft delete flag
 */
export interface NoteEntity {
  idNote: number;
  idAccount: number;
  idUser: number;
  title: string;
  content: string;
  dateCreated: Date;
  dateModified: Date;
  deleted: boolean;
}

/**
 * @interface NoteCreateRequest
 * @description Request parameters for creating a new note
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idUser - User identifier
 * @property {string} title - Note title (max 255 characters)
 * @property {string} content - Note content
 */
export interface NoteCreateRequest {
  idAccount: number;
  idUser: number;
  title: string;
  content: string;
}

/**
 * @interface NoteCreateResponse
 * @description Response from note creation operation
 *
 * @property {number} idNote - Identifier of the created note
 */
export interface NoteCreateResponse {
  idNote: number;
}
