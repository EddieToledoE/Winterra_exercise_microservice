import { ExerciseSessionRepository } from '../../domain/repositories/exercise-session-repository';
import { ExerciseSession } from '../../domain/entities/user-exercise';
import { ExerciseSessionModel } from '../database/models/exercise-session.model';
import { v4 as uuidv4 } from 'uuid';

export class MongoExerciseSessionRepository implements ExerciseSessionRepository {
  
  async create(session: Omit<ExerciseSession, 'id' | 'createdAt' | 'updatedAt'>): Promise<ExerciseSession> {
    // Generar IDs únicos para ejercicios y sets
    const sessionWithIds = {
      ...session,
      exercises: session.exercises.map(exercise => ({
        ...exercise,
        id: uuidv4(),
        sets: exercise.sets.map(set => ({
          ...set,
          id: uuidv4()
        }))
      }))
    };

    const createdSession = await ExerciseSessionModel.create(sessionWithIds);
    
    return this.mapToDomain(createdSession);
  }

  async findById(id: string): Promise<ExerciseSession | null> {
    const session = await ExerciseSessionModel.findById(id);
    return session ? this.mapToDomain(session) : null;
  }

  async findByUserId(userId: string, page: number = 1, limit: number = 10): Promise<{
    sessions: ExerciseSession[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    
    const [sessions, total] = await Promise.all([
      ExerciseSessionModel.find({ userId })
        .sort({ date: -1, startTime: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      ExerciseSessionModel.countDocuments({ userId })
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      sessions: sessions.map(session => this.mapToDomain(session)),
      total,
      page,
      totalPages
    };
  }

  async update(id: string, session: Partial<ExerciseSession>): Promise<ExerciseSession | null> {
    const updatedSession = await ExerciseSessionModel.findByIdAndUpdate(
      id,
      session,
      { new: true, runValidators: true }
    );
    
    return updatedSession ? this.mapToDomain(updatedSession) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await ExerciseSessionModel.findByIdAndDelete(id);
    return !!result;
  }

  async findByUserIdAndDateRange(userId: string, startDate: Date, endDate: Date): Promise<ExerciseSession[]> {
    const sessions = await ExerciseSessionModel.find({
      userId,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ date: -1, startTime: -1 });

    return sessions.map(session => this.mapToDomain(session));
  }

  async getSessionStats(userId: string): Promise<{
    totalSessions: number;
    totalDuration: number;
    totalSets: number;
    mostUsedMuscleGroups: Array<{ muscleGroup: string; count: number }>;
  }> {
    const sessions = await ExerciseSessionModel.find({ userId });
    
    const totalSessions = sessions.length;
    const totalDuration = sessions.reduce((sum, session) => sum + session.totalDuration, 0);
    const totalSets = sessions.reduce((sum, session) => sum + session.totalSets, 0);
    
    // Calcular grupos musculares más usados
    const muscleGroupCounts: Record<string, number> = {};
    sessions.forEach(session => {
      session.exercises.forEach(exercise => {
        muscleGroupCounts[exercise.muscleGroup] = (muscleGroupCounts[exercise.muscleGroup] || 0) + 1;
      });
    });

    const mostUsedMuscleGroups = Object.entries(muscleGroupCounts)
      .map(([muscleGroup, count]) => ({ muscleGroup, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalSessions,
      totalDuration,
      totalSets,
      mostUsedMuscleGroups
    };
  }

  private mapToDomain(mongooseSession: any): ExerciseSession {
    return {
      id: mongooseSession._id.toString(),
      userId: mongooseSession.userId,
      date: mongooseSession.date,
      startTime: mongooseSession.startTime,
      endTime: mongooseSession.endTime,
      totalDuration: mongooseSession.totalDuration,
      totalRestTime: mongooseSession.totalRestTime,
      totalSets: mongooseSession.totalSets,
      exercises: mongooseSession.exercises.map((exercise: any) => ({
        id: exercise.id,
        name: exercise.name,
        muscleGroup: exercise.muscleGroup,
        sets: exercise.sets.map((set: any) => ({
          id: set.id,
          reps: set.reps,
          weight: set.weight,
          restTime: set.restTime,
          completed: set.completed
        })),
        order: exercise.order
      })),
      statistics: {
        setsByMuscleGroup: mongooseSession.statistics.setsByMuscleGroup,
        totalCompletedSets: mongooseSession.statistics.totalCompletedSets,
        totalRestTime: mongooseSession.statistics.totalRestTime
      },
      notes: mongooseSession.notes,
      createdAt: mongooseSession.createdAt,
      updatedAt: mongooseSession.updatedAt
    };
  }
} 