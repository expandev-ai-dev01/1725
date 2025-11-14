/**
 * @summary
 * Creates a new note with title and content for the authenticated user.
 * Automatically generates creation and modification timestamps.
 *
 * @procedure spNoteCreate
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - POST /api/v1/internal/note
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy isolation
 *
 * @param {INT} idUser
 *   - Required: Yes
 *   - Description: User identifier who is creating the note
 *
 * @param {NVARCHAR(255)} title
 *   - Required: Yes
 *   - Description: Title of the note (max 255 characters)
 *
 * @param {NVARCHAR(MAX)} content
 *   - Required: Yes
 *   - Description: Content of the note (supports text formatting)
 *
 * @returns {INT} idNote - Identifier of the created note
 *
 * @testScenarios
 * - Valid creation with all required parameters
 * - Validation failure for empty title
 * - Validation failure for empty content
 * - Validation failure for title exceeding 255 characters
 * - Security validation for invalid account/user
 */
CREATE OR ALTER PROCEDURE [functional].[spNoteCreate]
  @idAccount INTEGER,
  @idUser INTEGER,
  @title NVARCHAR(255),
  @content NVARCHAR(MAX)
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Required parameter validation
   * @throw {parameterRequired}
   */
  IF (@idAccount IS NULL)
  BEGIN
    ;THROW 51000, 'idAccountRequired', 1;
  END;

  IF (@idUser IS NULL)
  BEGIN
    ;THROW 51000, 'idUserRequired', 1;
  END;

  IF (@title IS NULL OR LTRIM(RTRIM(@title)) = '')
  BEGIN
    ;THROW 51000, 'titleRequired', 1;
  END;

  IF (@content IS NULL OR LTRIM(RTRIM(@content)) = '')
  BEGIN
    ;THROW 51000, 'contentRequired', 1;
  END;

  /**
   * @validation Title length validation
   * @throw {titleExceedsMaxLength}
   */
  IF (LEN(@title) > 255)
  BEGIN
    ;THROW 51000, 'titleExceedsMaxLength', 1;
  END;

  /**
   * @validation User belongs to account validation
   * @throw {userDoesNotBelongToAccount}
   */
  IF NOT EXISTS (
    SELECT *
    FROM [security].[user] usr
    WHERE usr.[idUser] = @idUser
      AND usr.[idAccount] = @idAccount
      AND usr.[deleted] = 0
  )
  BEGIN
    ;THROW 51000, 'userDoesNotBelongToAccount', 1;
  END;

  BEGIN TRY
    /**
     * @rule {db-transaction-control} Transaction control for data integrity
     */
    BEGIN TRAN;

      DECLARE @currentDateTime DATETIME2 = GETUTCDATE();
      DECLARE @idNote INTEGER;

      /**
       * @rule {fn-note-creation} Insert new note with system-generated timestamps
       */
      INSERT INTO [functional].[note] (
        [idAccount],
        [idUser],
        [title],
        [content],
        [dateCreated],
        [dateModified],
        [deleted]
      )
      VALUES (
        @idAccount,
        @idUser,
        @title,
        @content,
        @currentDateTime,
        @currentDateTime,
        0
      );

      SET @idNote = SCOPE_IDENTITY();

      /**
       * @output {NoteCreated, 1, 1}
       * @column {INT} idNote
       * - Description: Identifier of the created note
       */
      SELECT @idNote AS [idNote];

    COMMIT TRAN;
  END TRY
  BEGIN CATCH
    ROLLBACK TRAN;
    THROW;
  END CATCH;
END;
GO