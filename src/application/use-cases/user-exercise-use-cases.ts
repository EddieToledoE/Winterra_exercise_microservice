import { UserExerciseRepository } from '../../domain/repositories/user-exercise-repository';
import {
  CreateUserExerciseDto,
  UpdateUserExerciseDto,
  UserExerciseResponseDto,
  UserExerciseListResponseDto,
  UserExerciseStatsDto,
  UserExerciseMapper
} from '../dtos/user-exercise-dto';
import { UserExercise } from '../../domain/entities/user-exercise';

export class UserExerciseUseCases {
  constructor(private userExerciseRepository: UserExerciseRepository) {}

  // Caso de uso: Obtener ejercicios del usuario
  async getUserExercises(
    userId: string,
    pagination: { page: number; limit: number }
  ): Promise<UserExerciseListResponseDto> {
    const result = await this.userExerciseRepository.findWithPagination(
      userId,
      pagination.page,
      pagination.limit
    );

    return {
      exercises: UserExerciseMapper.toResponseDtoList(result.exercises),
      total: result.total,
      page: result.page,
      totalPages: result.totalPages
    };
  }

  // Caso de uso: Obtener ejercicio específico del usuario
  async getUserExerciseById(userId: string, id: string): Promise<UserExerciseResponseDto | null> {
    const exercise = await this.userExerciseRepository.findById(id);
    
    if (!exercise || exercise.userId !== userId) {
      return null;
    }

    return UserExerciseMapper.toResponseDto(exercise);
  }

  // Caso de uso: Crear ejercicio para el usuario
  async createUserExercise(userId: string, dto: CreateUserExerciseDto): Promise<UserExerciseResponseDto> {
    // Validar datos
    this.validateCreateExerciseData(dto);

    const exerciseData = UserExerciseMapper.fromCreateDto(dto);
    exerciseData.userId = userId;

    // Generar IDs para los sets
    exerciseData.sets = exerciseData.sets.map(set => ({
      ...set,
      id: this.generateId()
    }));

    const exercise = await this.userExerciseRepository.create(exerciseData);
    return UserExerciseMapper.toResponseDto(exercise);
  }

  // Caso de uso: Actualizar ejercicio del usuario
  async updateUserExercise(
    userId: string,
    id: string,
    dto: UpdateUserExerciseDto
  ): Promise<UserExerciseResponseDto | null> {
    const existingExercise = await this.userExerciseRepository.findById(id);
    
    if (!existingExercise || existingExercise.userId !== userId) {
      return null;
    }

    // Validar datos si se proporcionan
    if (dto.sets) {
      this.validateSets(dto.sets);
    }

    // Convertir los sets para incluir IDs si se proporcionan
    const updateData: Partial<UserExercise> = {};
    if (dto.name) updateData.name = dto.name;
    if (dto.sets) {
      updateData.sets = dto.sets.map(set => ({
        ...set,
        id: this.generateId()
      }));
    }

    const updatedExercise = await this.userExerciseRepository.update(id, updateData);
    
    if (!updatedExercise) {
      return null;
    }

    return UserExerciseMapper.toResponseDto(updatedExercise);
  }

  // Caso de uso: Eliminar ejercicio del usuario
  async deleteUserExercise(userId: string, id: string): Promise<boolean> {
    const exercise = await this.userExerciseRepository.findById(id);
    
    if (!exercise || exercise.userId !== userId) {
      return false;
    }

    return await this.userExerciseRepository.delete(id);
  }

  // Caso de uso: Buscar ejercicios del usuario
  async searchUserExercises(userId: string, query: string): Promise<UserExerciseResponseDto[]> {
    if (!query || query.trim().length < 2) {
      throw new Error('Search query must be at least 2 characters long');
    }

    const exercises = await this.userExerciseRepository.searchByText(userId, query.trim());
    return UserExerciseMapper.toResponseDtoList(exercises);
  }

  // Caso de uso: Obtener estadísticas de ejercicios del usuario
  async getUserExerciseStats(userId: string): Promise<UserExerciseStatsDto> {
    return await this.userExerciseRepository.getUserExerciseStats(userId);
  }

  // Validaciones privadas
  private validateCreateExerciseData(dto: CreateUserExerciseDto): void {
    if (!dto.name || dto.name.trim().length < 1) {
      throw new Error('Exercise name is required');
    }

    if (!dto.sets || dto.sets.length === 0) {
      throw new Error('At least one set is required');
    }

    this.validateSets(dto.sets);
  }

  private validateSets(sets: any[]): void {
    sets.forEach((set, index) => {
      if (!set.reps || set.reps < 1) {
        throw new Error(`Set ${index + 1}: Reps must be at least 1`);
      }

      if (set.weight !== undefined && set.weight < 0) {
        throw new Error(`Set ${index + 1}: Weight cannot be negative`);
      }

      if (set.duration !== undefined && set.duration < 0) {
        throw new Error(`Set ${index + 1}: Duration cannot be negative`);
      }

      if (set.restTime < 0) {
        throw new Error(`Set ${index + 1}: Rest time cannot be negative`);
      }
    });
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
} 