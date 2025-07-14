import { ExerciseService } from '../../domain/services/exercise-service';
import { ExerciseRepository } from '../../domain/repositories/exercise-repository';
import {
  CreateExerciseDto,
  UpdateExerciseDto,
  ExerciseFiltersDto,
  ExerciseResponseDto,
  ExerciseListResponseDto,
  ExerciseStatsDto,
  UserProfileDto,
  ExerciseRecommendationDto,
  ExerciseProgressDto,
  ExerciseMapper
} from '../dtos/exercise-dto';
import { Exercise } from '../../domain/entities/exercise';

export class ExerciseUseCases {
  constructor(
    private exerciseService: ExerciseService,
    private exerciseRepository: ExerciseRepository
  ) {}

  // Caso de uso: Crear ejercicio
  async createExercise(dto: CreateExerciseDto): Promise<ExerciseResponseDto> {
    const exerciseData = ExerciseMapper.fromCreateDto(dto);
    const exercise = await this.exerciseService.createExercise(exerciseData);
    return ExerciseMapper.toResponseDto(exercise);
  }

  // Caso de uso: Obtener ejercicio por ID
  async getExerciseById(id: string): Promise<ExerciseResponseDto | null> {
    const exercise = await this.exerciseRepository.findById(id);
    if (!exercise) {
      return null;
    }
    return ExerciseMapper.toResponseDto(exercise);
  }

  // Caso de uso: Listar ejercicios con filtros
  async getExercises(filters: ExerciseFiltersDto): Promise<ExerciseListResponseDto> {
    const result = await this.exerciseService.findExercises(filters);
    return {
      exercises: ExerciseMapper.toResponseDtoList(result.exercises),
      total: result.total,
      page: result.page,
      totalPages: result.totalPages
    };
  }

  // Caso de uso: Buscar ejercicios por texto
  async searchExercises(query: string): Promise<ExerciseResponseDto[]> {
    const exercises = await this.exerciseService.searchExercises(query);
    return ExerciseMapper.toResponseDtoList(exercises);
  }

  // Caso de uso: Actualizar ejercicio
  async updateExercise(id: string, dto: UpdateExerciseDto): Promise<ExerciseResponseDto | null> {
    const exercise = await this.exerciseRepository.update(id, dto);
    if (!exercise) {
      return null;
    }
    return ExerciseMapper.toResponseDto(exercise);
  }

  // Caso de uso: Eliminar ejercicio
  async deleteExercise(id: string): Promise<boolean> {
    return await this.exerciseRepository.delete(id);
  }

  // Caso de uso: Obtener estadísticas de ejercicios
  async getExerciseStats(): Promise<ExerciseStatsDto> {
    return await this.exerciseRepository.getExerciseStats();
  }

  // Caso de uso: Obtener ejercicios recomendados
  async getRecommendedExercises(userProfile: UserProfileDto): Promise<ExerciseRecommendationDto[]> {
    const exercises = await this.exerciseService.getRecommendedExercises(userProfile);
    
    return exercises.map((exercise) => ({
      exercise: ExerciseMapper.toResponseDto(exercise),
      score: this.calculateRecommendationScore(exercise, userProfile),
      reason: this.getRecommendationReason(exercise, userProfile)
    }));
  }

  // Caso de uso: Calcular progreso de ejercicio
  async calculateExerciseProgress(
    exerciseId: string,
    sessions: any[]
  ): Promise<ExerciseProgressDto | null> {
    const exercise = await this.exerciseRepository.findById(exerciseId);
    if (!exercise) {
      return null;
    }

    const progress = await this.exerciseService.calculateExerciseProgress(exerciseId, sessions);
    
    return {
      exerciseId,
      exerciseName: exercise.name,
      totalSessions: progress.totalSessions,
      totalSets: progress.totalSets,
      averageWeight: progress.averageWeight,
      maxWeight: progress.maxWeight,
      progress: progress.progress,
      lastSession: this.getLastSessionDate(sessions, exerciseId)
    };
  }

  // Caso de uso: Obtener ejercicios por categoría
  async getExercisesByCategory(category: string): Promise<ExerciseResponseDto[]> {
    const exercises = await this.exerciseRepository.findByCategory(category as any);
    return ExerciseMapper.toResponseDtoList(exercises);
  }

  // Caso de uso: Obtener ejercicios por grupo muscular
  async getExercisesByMuscleGroup(muscleGroup: string): Promise<ExerciseResponseDto[]> {
    const exercises = await this.exerciseRepository.findByMuscleGroup(muscleGroup as any);
    return ExerciseMapper.toResponseDtoList(exercises);
  }

  // Caso de uso: Obtener ejercicios por dificultad
  async getExercisesByDifficulty(difficulty: string): Promise<ExerciseResponseDto[]> {
    const exercises = await this.exerciseRepository.findByDifficulty(difficulty as any);
    return ExerciseMapper.toResponseDtoList(exercises);
  }

  // Métodos privados para lógica de recomendaciones
  private calculateRecommendationScore(exercise: Exercise, userProfile: UserProfileDto): number {
    let score = 0;

    // Score basado en nivel de dificultad
    const difficultyScore = this.getDifficultyScore(exercise.difficulty, userProfile.fitnessLevel);
    score += difficultyScore;

    // Score basado en objetivos
    const goalScore = this.getGoalScore(exercise, userProfile.goals);
    score += goalScore;

    // Score basado en experiencia
    const experienceScore = this.getExperienceScore(exercise, userProfile.experience);
    score += experienceScore;

    return Math.min(score, 100); // Máximo 100
  }

  private getDifficultyScore(difficulty: string, fitnessLevel: string): number {
    const difficultyMap: Record<string, number> = {
      'beginner': 1,
      'intermediate': 2,
      'advanced': 3
    };

    const levelMap: Record<string, number> = {
      'beginner': 1,
      'intermediate': 2,
      'advanced': 3,
      'expert': 4
    };

    const diff = Math.abs((difficultyMap[difficulty] || 1) - (levelMap[fitnessLevel] || 1));
    return Math.max(0, 30 - diff * 10); // Máximo 30 puntos
  }

  private getGoalScore(exercise: Exercise, goals: string[]): number {
    const goalExerciseMapping: Record<string, string[]> = {
      'muscle_gain': ['strength'],
      'strength': ['strength'],
      'endurance': ['cardio'],
      'flexibility': ['flexibility'],
      'general_fitness': ['strength', 'cardio', 'functional']
    };

    let score = 0;
    goals.forEach(goal => {
      const mappedCategories = goalExerciseMapping[goal] || [];
      if (mappedCategories.includes(exercise.category)) {
        score += 20;
      }
    });

    return Math.min(score, 40); // Máximo 40 puntos
  }

  private getExperienceScore(exercise: Exercise, experience: string): number {
    const experienceMap: Record<string, number> = {
      'new': 1,
      'some_experience': 2,
      'experienced': 3,
      'very_experienced': 4
    };

    const difficultyMap: Record<string, number> = {
      'beginner': 1,
      'intermediate': 2,
      'advanced': 3
    };

    const diff = Math.abs((difficultyMap[exercise.difficulty] || 1) - (experienceMap[experience] || 1));
    return Math.max(0, 30 - diff * 10); // Máximo 30 puntos
  }

  private getRecommendationReason(exercise: Exercise, userProfile: UserProfileDto): string {
    const reasons: string[] = [];

    // Razón basada en nivel de dificultad
    if (exercise.difficulty === 'beginner' && userProfile.fitnessLevel === 'beginner') {
      reasons.push('Perfecto para principiantes');
    }

    // Razón basada en objetivos
    const goalMapping: Record<string, string> = {
      'muscle_gain': 'Ideal para ganancia muscular',
      'strength': 'Excelente para fuerza',
      'endurance': 'Perfecto para resistencia',
      'flexibility': 'Ideal para flexibilidad'
    };

    userProfile.goals.forEach(goal => {
      if (goalMapping[goal]) {
        reasons.push(goalMapping[goal]);
      }
    });

    return reasons.length > 0 ? reasons.join(', ') : 'Ejercicio recomendado para tu perfil';
  }

  private getLastSessionDate(sessions: any[], exerciseId: string): string | undefined {
    const exerciseSessions = sessions.filter(session => 
      session.exercises.some((entry: any) => entry.exercise.id === exerciseId)
    );

    if (exerciseSessions.length === 0) {
      return undefined;
    }

    // Ordenar por fecha y obtener la más reciente
    const sortedSessions = exerciseSessions.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return sortedSessions[0]?.date;
  }
} 