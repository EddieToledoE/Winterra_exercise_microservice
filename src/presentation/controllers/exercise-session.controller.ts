import { Request, Response } from 'express';
import { ExerciseSessionUseCases } from '../../application/use-cases/exercise-session-use-cases';
import { CreateExerciseSessionDto } from '../../application/dtos/exercise-session-dto';

export class ExerciseSessionController {
  constructor(private exerciseSessionUseCases: ExerciseSessionUseCases) {}

  // POST /api/v1/users/:userId/sessions
  async createExerciseSession(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const sessionData: CreateExerciseSessionDto = req.body;

      // Asegurar que el userId del body coincida con el de la URL
      sessionData.userId = userId;

      const session = await this.exerciseSessionUseCases.createExerciseSession(userId, sessionData);

      res.status(201).json({
        success: true,
        message: 'Exercise session created successfully',
        data: session
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('validation')) {
        res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: error.message
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // GET /api/v1/users/:userId/sessions
  async getUserExerciseSessions(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 10 } = req.query;

      const result = await this.exerciseSessionUseCases.getUserExerciseSessions(
        userId,
        parseInt(page as string),
        parseInt(limit as string)
      );

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // GET /api/v1/users/:userId/sessions/:id
  async getExerciseSessionById(req: Request, res: Response): Promise<void> {
    try {
      const { userId, id } = req.params;

      const session = await this.exerciseSessionUseCases.getExerciseSessionById(userId, id);

      if (!session) {
        res.status(404).json({
          success: false,
          error: 'Not Found',
          message: 'Exercise session not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: session
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // PUT /api/v1/users/:userId/sessions/:id
  async updateExerciseSession(req: Request, res: Response): Promise<void> {
    try {
      const { userId, id } = req.params;
      const sessionData: Partial<CreateExerciseSessionDto> = req.body;

      const session = await this.exerciseSessionUseCases.updateExerciseSession(userId, id, sessionData);

      if (!session) {
        res.status(404).json({
          success: false,
          error: 'Not Found',
          message: 'Exercise session not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Exercise session updated successfully',
        data: session
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('validation')) {
        res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: error.message
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // DELETE /api/v1/users/:userId/sessions/:id
  async deleteExerciseSession(req: Request, res: Response): Promise<void> {
    try {
      const { userId, id } = req.params;

      const deleted = await this.exerciseSessionUseCases.deleteExerciseSession(userId, id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          error: 'Not Found',
          message: 'Exercise session not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Exercise session deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // GET /api/v1/users/:userId/sessions/stats
  async getUserSessionStats(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      const stats = await this.exerciseSessionUseCases.getUserSessionStats(userId);

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // GET /api/v1/users/:userId/sessions/range
  async getUserSessionsByDateRange(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'startDate and endDate query parameters are required'
        });
        return;
      }

      const sessions = await this.exerciseSessionUseCases.getUserSessionsByDateRange(
        userId,
        new Date(startDate as string),
        new Date(endDate as string)
      );

      res.status(200).json({
        success: true,
        data: {
          sessions,
          total: sessions.length,
          startDate,
          endDate
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // GET /api/v1/users/:userId/sessions/weekly-summary
  async getWeeklyMuscleGroupSummary(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'startDate and endDate query parameters are required'
        });
        return;
      }

      const summary = await this.exerciseSessionUseCases.getWeeklyMuscleGroupSummary(
        userId,
        new Date(startDate as string),
        new Date(endDate as string)
      );

      res.status(200).json({
        success: true,
        data: summary
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
} 