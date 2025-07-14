import { Request, Response } from 'express';
import { UserExerciseUseCases } from '../../application/use-cases/user-exercise-use-cases';
import { CreateUserExerciseDto, UpdateUserExerciseDto } from '../../application/dtos/user-exercise-dto';

export class UserExerciseController {
  constructor(private userExerciseUseCases: UserExerciseUseCases) {}

  // GET /api/v1/users/:userId/exercises
  async getUserExercises(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 10 } = req.query;

      const result = await this.userExerciseUseCases.getUserExercises(
        userId,
        {
          page: parseInt(page as string),
          limit: parseInt(limit as string)
        }
      );

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // GET /api/v1/users/:userId/exercises/:id
  async getUserExerciseById(req: Request, res: Response): Promise<void> {
    try {
      const { userId, id } = req.params;

      const exercise = await this.userExerciseUseCases.getUserExerciseById(userId, id);

      if (!exercise) {
        res.status(404).json({
          error: 'Not Found',
          message: 'Exercise not found'
        });
        return;
      }

      res.status(200).json(exercise);
    } catch (error) {
      res.status(500).json({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // POST /api/v1/users/:userId/exercises
  async createUserExercise(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const exerciseData: CreateUserExerciseDto = req.body;

      const exercise = await this.userExerciseUseCases.createUserExercise(userId, exerciseData);

      res.status(201).json(exercise);
    } catch (error) {
      if (error instanceof Error && error.message.includes('validation')) {
        res.status(400).json({
          error: 'Validation Error',
          message: error.message
        });
        return;
      }

      res.status(500).json({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // PUT /api/v1/users/:userId/exercises/:id
  async updateUserExercise(req: Request, res: Response): Promise<void> {
    try {
      const { userId, id } = req.params;
      const exerciseData: UpdateUserExerciseDto = req.body;

      const exercise = await this.userExerciseUseCases.updateUserExercise(userId, id, exerciseData);

      if (!exercise) {
        res.status(404).json({
          error: 'Not Found',
          message: 'Exercise not found'
        });
        return;
      }

      res.status(200).json(exercise);
    } catch (error) {
      if (error instanceof Error && error.message.includes('validation')) {
        res.status(400).json({
          error: 'Validation Error',
          message: error.message
        });
        return;
      }

      res.status(500).json({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // DELETE /api/v1/users/:userId/exercises/:id
  async deleteUserExercise(req: Request, res: Response): Promise<void> {
    try {
      const { userId, id } = req.params;

      const deleted = await this.userExerciseUseCases.deleteUserExercise(userId, id);

      if (!deleted) {
        res.status(404).json({
          error: 'Not Found',
          message: 'Exercise not found'
        });
        return;
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // GET /api/v1/users/:userId/exercises/search
  async searchUserExercises(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { q } = req.query;

      if (!q || typeof q !== 'string') {
        res.status(400).json({
          error: 'Bad Request',
          message: 'Query parameter "q" is required'
        });
        return;
      }

      const exercises = await this.userExerciseUseCases.searchUserExercises(userId, q);

      res.status(200).json({
        exercises,
        total: exercises.length,
        query: q
      });
    } catch (error) {
      res.status(500).json({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // GET /api/v1/users/:userId/exercises/stats
  async getUserExerciseStats(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      const stats = await this.userExerciseUseCases.getUserExerciseStats(userId);

      res.status(200).json(stats);
    } catch (error) {
      res.status(500).json({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
} 