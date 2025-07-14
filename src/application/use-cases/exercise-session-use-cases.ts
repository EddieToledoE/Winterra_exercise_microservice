import { ExerciseSessionRepository } from '../../domain/repositories/exercise-session-repository';
import { ExerciseSession } from '../../domain/entities/user-exercise';
import { CreateExerciseSessionDto, ExerciseSessionMapper } from '../dtos/exercise-session-dto';

export class ExerciseSessionUseCases {
  constructor(private exerciseSessionRepository: ExerciseSessionRepository) {}

  async createExerciseSession(userId: string, sessionData: CreateExerciseSessionDto): Promise<any> {
    // Validar que el userId coincida
    if (sessionData.userId !== userId) {
      throw new Error('User ID mismatch');
    }

    // Validar datos requeridos
    if (!sessionData.date || !sessionData.startTime) {
      throw new Error('Date and startTime are required');
    }

    // Si no hay endTime, calcularlo basado en startTime y totalDuration
    if (!sessionData.endTime) {
      const startTime = new Date(sessionData.startTime);
      const endTime = new Date(startTime.getTime() + (sessionData.totalDuration * 1000));
      sessionData.endTime = endTime.toISOString();
    }

    if (!sessionData.exercises || sessionData.exercises.length === 0) {
      throw new Error('At least one exercise is required');
    }

    // Validar que cada ejercicio tenga al menos un set
    for (const exercise of sessionData.exercises) {
      if (!exercise.sets || exercise.sets.length === 0) {
        throw new Error(`Exercise ${exercise.name} must have at least one set`);
      }
    }

    // Mapear DTO a entidad de dominio
    const sessionEntity = ExerciseSessionMapper.fromCreateDto(sessionData);
    
    // Crear la sesión
    const createdSession = await this.exerciseSessionRepository.create(sessionEntity);
    
    // Retornar DTO de respuesta
    return ExerciseSessionMapper.toResponseDto(createdSession);
  }

  async getExerciseSessionById(userId: string, sessionId: string): Promise<any | null> {
    const session = await this.exerciseSessionRepository.findById(sessionId);
    
    if (!session) {
      return null;
    }

    // Verificar que la sesión pertenece al usuario
    if (session.userId !== userId) {
      throw new Error('Session not found for this user');
    }

    return ExerciseSessionMapper.toResponseDto(session);
  }

  async getUserExerciseSessions(userId: string, page: number = 1, limit: number = 10): Promise<any> {
    const result = await this.exerciseSessionRepository.findByUserId(userId, page, limit);
    
    return {
      sessions: ExerciseSessionMapper.toResponseDtoList(result.sessions),
      total: result.total,
      page: result.page,
      totalPages: result.totalPages
    };
  }

  async updateExerciseSession(userId: string, sessionId: string, sessionData: Partial<CreateExerciseSessionDto>): Promise<any | null> {
    // Verificar que la sesión existe y pertenece al usuario
    const existingSession = await this.exerciseSessionRepository.findById(sessionId);
    if (!existingSession || existingSession.userId !== userId) {
      return null;
    }

    // Actualizar solo los campos permitidos
    const updateData: Partial<ExerciseSession> = {};
    
    if (sessionData.date) updateData.date = new Date(sessionData.date);
    if (sessionData.startTime) updateData.startTime = new Date(sessionData.startTime);
    if (sessionData.endTime) updateData.endTime = new Date(sessionData.endTime);
    if (sessionData.totalDuration !== undefined) updateData.totalDuration = sessionData.totalDuration;
    if (sessionData.totalRestTime !== undefined) updateData.totalRestTime = sessionData.totalRestTime;
    if (sessionData.totalSets !== undefined) updateData.totalSets = sessionData.totalSets;
    if (sessionData.exercises) {
      updateData.exercises = sessionData.exercises.map((exercise, index) => ({
        id: '', // Se generará automáticamente
        name: exercise.name,
        muscleGroup: exercise.muscleGroup,
        sets: exercise.sets.map(set => ({
          id: '', // Se generará automáticamente
          reps: set.reps,
          weight: set.weight,
          restTime: set.restTime,
          completed: set.completed
        })),
        order: index + 1
      }));
    }
    if (sessionData.statistics) updateData.statistics = sessionData.statistics;

    const updatedSession = await this.exerciseSessionRepository.update(sessionId, updateData);
    
    return updatedSession ? ExerciseSessionMapper.toResponseDto(updatedSession) : null;
  }

  async deleteExerciseSession(userId: string, sessionId: string): Promise<boolean> {
    // Verificar que la sesión existe y pertenece al usuario
    const existingSession = await this.exerciseSessionRepository.findById(sessionId);
    if (!existingSession || existingSession.userId !== userId) {
      return false;
    }

    return await this.exerciseSessionRepository.delete(sessionId);
  }

  async getUserSessionStats(userId: string): Promise<any> {
    const stats = await this.exerciseSessionRepository.getSessionStats(userId);
    
    return {
      totalSessions: stats.totalSessions,
      totalDuration: stats.totalDuration,
      totalSets: stats.totalSets,
      mostUsedMuscleGroups: stats.mostUsedMuscleGroups,
      averageSessionDuration: stats.totalSessions > 0 ? Math.round(stats.totalDuration / stats.totalSessions) : 0,
      averageSetsPerSession: stats.totalSessions > 0 ? Math.round(stats.totalSets / stats.totalSessions) : 0
    };
  }

  async getUserSessionsByDateRange(userId: string, startDate: Date, endDate: Date): Promise<any[]> {
    const sessions = await this.exerciseSessionRepository.findByUserIdAndDateRange(userId, startDate, endDate);
    return ExerciseSessionMapper.toResponseDtoList(sessions);
  }
} 