/**
 * @summary
 * Note API controller for CRUD operations
 *
 * @module api/v1/internal/note/controller
 *
 * @description
 * Handles HTTP requests for note management operations
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { noteCreate } from '@/services/note';
import { successResponse, errorResponse } from '@/utils/response';

/**
 * @api {post} /api/v1/internal/note Create Note
 * @apiName CreateNote
 * @apiGroup Note
 * @apiVersion 1.0.0
 *
 * @apiDescription Creates a new note with title and content
 *
 * @apiParam {Number} idAccount Account identifier
 * @apiParam {Number} idUser User identifier
 * @apiParam {String} title Note title (max 255 characters)
 * @apiParam {String} content Note content
 *
 * @apiSuccess {Number} idNote Created note identifier
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */
export async function postHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  /**
   * @validation Request body validation schema
   */
  const bodySchema = z.object({
    idAccount: z.number().int().positive(),
    idUser: z.number().int().positive(),
    title: z.string().min(1).max(255),
    content: z.string().min(1),
  });

  try {
    /**
     * @validation Parse and validate request body
     */
    const validated = bodySchema.parse(req.body);

    /**
     * @rule {fn-note-creation} Execute note creation business logic
     */
    const data = await noteCreate({
      idAccount: validated.idAccount,
      idUser: validated.idUser,
      title: validated.title,
      content: validated.content,
    });

    res.status(201).json(successResponse(data));
  } catch (error: any) {
    /**
     * @remarks Handle validation errors
     */
    if (error instanceof z.ZodError) {
      res.status(400).json(errorResponse('Validation failed', 'VALIDATION_ERROR', error.errors));
      return;
    }

    /**
     * @remarks Handle business rule errors from database
     */
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message, 'BUSINESS_RULE_ERROR'));
      return;
    }

    /**
     * @remarks Pass unexpected errors to global error handler
     */
    next(error);
  }
}
