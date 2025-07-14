import { Router } from 'express';
import { UserExerciseController } from '../controllers/user-exercise.controller';
import { UserExerciseUseCases } from '../../application/use-cases/user-exercise-use-cases';
import { MongoUserExerciseRepository } from '../../infrastructure/repositories/user-exercise-repository';

const router = Router();

// Inyección de dependencias
const userExerciseRepository = new MongoUserExerciseRepository();
const userExerciseUseCases = new UserExerciseUseCases(userExerciseRepository);
const userExerciseController = new UserExerciseController(userExerciseUseCases);

// Middleware para extraer userId del token (se implementará después)
const extractUserId = (req: any, _res: any, next: any) => {
  // Por ahora, usamos el userId de los parámetros
  // En el futuro, esto vendrá del token JWT
  req.userId = req.params.userId;
  next();
};

// Rutas para ejercicios del usuario
router.get('/users/:userId/exercises', extractUserId, userExerciseController.getUserExercises.bind(userExerciseController));
router.get('/users/:userId/exercises/:id', extractUserId, userExerciseController.getUserExerciseById.bind(userExerciseController));
router.post('/users/:userId/exercises', extractUserId, userExerciseController.createUserExercise.bind(userExerciseController));
router.put('/users/:userId/exercises/:id', extractUserId, userExerciseController.updateUserExercise.bind(userExerciseController));
router.delete('/users/:userId/exercises/:id', extractUserId, userExerciseController.deleteUserExercise.bind(userExerciseController));
router.get('/users/:userId/exercises/search', extractUserId, userExerciseController.searchUserExercises.bind(userExerciseController));
router.get('/users/:userId/exercises/stats', extractUserId, userExerciseController.getUserExerciseStats.bind(userExerciseController));

export default router; 