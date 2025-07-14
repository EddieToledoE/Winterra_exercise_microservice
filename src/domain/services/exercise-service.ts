import { Exercise, ExerciseCategory, MuscleGroup, ExerciseDifficulty } from '../entities/exercise';
import { ExerciseRepository } from '../repositories/exercise-repository';
import { Weight } from '../value-objects/weight';

export class ExerciseService {
  constructor(private exerciseRepository: ExerciseRepository) {}

  // Crear un nuevo ejercicio con validaciones
  async createExercise(exerciseData: Omit<Exercise, 'id' | 'createdAt' | 'updatedAt'>): Promise<Exercise> {
    // Validaciones de negocio
    this.validateExerciseData(exerciseData);
    
    return await this.exerciseRepository.create(exerciseData);
  }

  // Buscar ejercicios con filtros avanzados
  async findExercises(filters: {
    category?: ExerciseCategory;
    muscleGroups?: MuscleGroup[];
    difficulty?: ExerciseDifficulty;
    name?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    exercises: Exercise[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const { page = 1, limit = 10, ...searchFilters } = filters;
    
    if (searchFilters.name || searchFilters.category || searchFilters.muscleGroups || searchFilters.difficulty) {
      const exercises = await this.exerciseRepository.findByFilters(searchFilters);
      return {
        exercises,
        total: exercises.length,
        page: 1,
        totalPages: 1
      };
    }

    return await this.exerciseRepository.findWithPagination(page, limit);
  }

  // Buscar ejercicios por texto
  async searchExercises(query: string): Promise<Exercise[]> {
    if (!query || query.trim().length < 2) {
      throw new Error('Search query must be at least 2 characters long');
    }

    return await this.exerciseRepository.searchByText(query.trim());
  }

  // Obtener ejercicios recomendados basados en el perfil del usuario
  async getRecommendedExercises(userProfile: {
    fitnessLevel: string;
    goals: string[];
    experience: string;
  }): Promise<Exercise[]> {
    // Lógica para recomendar ejercicios basada en el perfil
    const recommendedExercises: Exercise[] = [];
    
    // Obtener ejercicios por nivel de dificultad
    const difficulty = this.mapFitnessLevelToDifficulty(userProfile.fitnessLevel);
    const exercises = await this.exerciseRepository.findByDifficulty(difficulty);
    
    // Filtrar por objetivos del usuario
    const filteredExercises = exercises.filter(exercise => {
      return this.matchesUserGoals(exercise, userProfile.goals);
    });

    return filteredExercises.slice(0, 10); // Limitar a 10 recomendaciones
  }

  // Calcular progreso de un ejercicio específico
  async calculateExerciseProgress(
    userId: string,
    exerciseId: string,
    sessions: any[] // Tipado simplificado por ahora
  ): Promise<{
    totalSessions: number;
    totalSets: number;
    averageWeight: number;
    maxWeight: number;
    progress: number; // Porcentaje de mejora
  }> {
    const exerciseSessions = sessions.filter(session => 
      session.exercises.some((entry: any) => entry.exercise.id === exerciseId)
    );

    if (exerciseSessions.length === 0) {
      return {
        totalSessions: 0,
        totalSets: 0,
        averageWeight: 0,
        maxWeight: 0,
        progress: 0
      };
    }

    // Calcular estadísticas
    const weights: number[] = [];
    let totalSets = 0;

    exerciseSessions.forEach(session => {
      session.exercises.forEach((entry: any) => {
        if (entry.exercise.id === exerciseId) {
          entry.sets.forEach((set: any) => {
            if (set.weight) {
              weights.push(set.weight);
            }
            totalSets++;
          });
        }
      });
    });

    const averageWeight = weights.length > 0 ? weights.reduce((a, b) => a + b, 0) / weights.length : 0;
    const maxWeight = weights.length > 0 ? Math.max(...weights) : 0;

    // Calcular progreso (simplificado)
    const progress = this.calculateProgressPercentage(weights);

    return {
      totalSessions: exerciseSessions.length,
      totalSets,
      averageWeight,
      maxWeight,
      progress
    };
  }

  // Validaciones privadas
  private validateExerciseData(exercise: Omit<Exercise, 'id' | 'createdAt' | 'updatedAt'>): void {
    if (!exercise.name || exercise.name.trim().length < 2) {
      throw new Error('Exercise name must be at least 2 characters long');
    }

    if (!exercise.category) {
      throw new Error('Exercise category is required');
    }

    if (!exercise.muscleGroups || exercise.muscleGroups.length === 0) {
      throw new Error('At least one muscle group must be specified');
    }

    if (!exercise.difficulty) {
      throw new Error('Exercise difficulty is required');
    }
  }

  private mapFitnessLevelToDifficulty(fitnessLevel: string): ExerciseDifficulty {
    switch (fitnessLevel) {
      case 'beginner':
        return ExerciseDifficulty.BEGINNER;
      case 'intermediate':
        return ExerciseDifficulty.INTERMEDIATE;
      case 'advanced':
      case 'expert':
        return ExerciseDifficulty.ADVANCED;
      default:
        return ExerciseDifficulty.BEGINNER;
    }
  }

  private matchesUserGoals(exercise: Exercise, userGoals: string[]): boolean {
    // Lógica simplificada para matching de objetivos
    const goalExerciseMapping: Record<string, ExerciseCategory[]> = {
      'muscle_gain': [ExerciseCategory.STRENGTH],
      'strength': [ExerciseCategory.STRENGTH],
      'endurance': [ExerciseCategory.CARDIO],
      'flexibility': [ExerciseCategory.FLEXIBILITY],
      'general_fitness': [ExerciseCategory.STRENGTH, ExerciseCategory.CARDIO, ExerciseCategory.FUNCTIONAL]
    };

    return userGoals.some(goal => {
      const mappedCategories = goalExerciseMapping[goal] || [];
      return mappedCategories.includes(exercise.category);
    });
  }

  private calculateProgressPercentage(weights: number[]): number {
    if (weights.length < 2) return 0;

    // Calcular tendencia de mejora
    const sortedWeights = [...weights].sort((a, b) => a - b);
    const firstHalf = sortedWeights.slice(0, Math.floor(sortedWeights.length / 2));
    const secondHalf = sortedWeights.slice(Math.floor(sortedWeights.length / 2));

    const firstHalfAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

    if (firstHalfAvg === 0) return 0;

    return ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100;
  }
} 