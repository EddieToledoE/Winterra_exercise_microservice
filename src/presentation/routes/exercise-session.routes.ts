import { Router } from 'express';
import { ExerciseSessionController } from '../controllers/exercise-session.controller';
import { ExerciseSessionUseCases } from '../../application/use-cases/exercise-session-use-cases';
import { MongoExerciseSessionRepository } from '../../infrastructure/repositories/exercise-session-repository';

const router = Router();

// Inyección de dependencias
const exerciseSessionRepository = new MongoExerciseSessionRepository();
const exerciseSessionUseCases = new ExerciseSessionUseCases(exerciseSessionRepository);
const exerciseSessionController = new ExerciseSessionController(exerciseSessionUseCases);

// Middleware para extraer userId del token (se implementará después)
const extractUserId = (req: any, _res: any, next: any) => {
  // Por ahora, usamos el userId de los parámetros
  // En el futuro, esto vendrá del token JWT
  req.userId = req.params.userId;
  next();
};

// Rutas para sesiones de ejercicio del usuario

router.get('/users/:userId/sessions/weekly-summary', extractUserId, exerciseSessionController.getWeeklyMuscleGroupSummary.bind(exerciseSessionController));
router.get('/users/:userId/sessions/range', extractUserId, exerciseSessionController.getUserSessionsByDateRange.bind(exerciseSessionController));

router.post('/users/:userId/sessions', extractUserId, exerciseSessionController.createExerciseSession.bind(exerciseSessionController));
router.post('/users/:userId/sessions/bulk-insert', exerciseSessionController.bulkInsertExerciseSessions.bind(exerciseSessionController));
router.get('/users/:userId/sessions', extractUserId, exerciseSessionController.getUserExerciseSessions.bind(exerciseSessionController));
router.get('/users/:userId/sessions/:id', extractUserId, exerciseSessionController.getExerciseSessionById.bind(exerciseSessionController));
router.put('/users/:userId/sessions/:id', extractUserId, exerciseSessionController.updateExerciseSession.bind(exerciseSessionController));
router.delete('/users/:userId/sessions/:id', extractUserId, exerciseSessionController.deleteExerciseSession.bind(exerciseSessionController));
router.get('/users/:userId/sessions/stats', extractUserId, exerciseSessionController.getUserSessionStats.bind(exerciseSessionController));
router.get('/sessions/all', exerciseSessionController.getAllExerciseSessions.bind(exerciseSessionController));

export default router; 