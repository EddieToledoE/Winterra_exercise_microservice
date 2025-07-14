import { User } from '../entities/user';

export interface UserRepository {
  // Operaciones básicas CRUD
  create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByFirebaseUid(firebaseUid: string): Promise<User | null>;
  update(id: string, user: Partial<User>): Promise<User | null>;
  delete(id: string): Promise<boolean>;

  // Búsquedas específicas
  findByEmail(email: string): Promise<User | null>;
  findByName(name: string): Promise<User[]>;
  
  // Búsquedas con filtros
  findByFilters(filters: {
    fitnessLevel?: string;
    goals?: string[];
    experience?: string;
  }): Promise<User[]>;

  // Estadísticas de usuarios
  getUserStats(): Promise<{
    total: number;
    byFitnessLevel: Record<string, number>;
    byExperience: Record<string, number>;
    activeUsers: number; // usuarios con actividad en los últimos 30 días
  }>;

  // Verificar si existe usuario por Firebase UID
  existsByFirebaseUid(firebaseUid: string): Promise<boolean>;

  // Actualizar perfil de usuario
  updateProfile(userId: string, profile: Partial<User['profile']>): Promise<User | null>;
  
  // Actualizar preferencias de usuario
  updatePreferences(userId: string, preferences: Partial<User['preferences']>): Promise<User | null>;
} 