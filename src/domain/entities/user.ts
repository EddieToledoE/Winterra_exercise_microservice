export interface User {
  id: string;
  firebaseUid: string;
  name: string;
  email: string;
  photoUrl?: string;
  profile: UserProfile;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  age?: number;
  gender?: Gender;
  height?: number; // en cm
  weight?: number; // en kg
  fitnessLevel: FitnessLevel;
  goals: FitnessGoal[];
  experience: ExperienceLevel;
}

export interface UserPreferences {
  units: UnitSystem;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  theme: 'light' | 'dark' | 'auto';
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say'
}

export enum FitnessLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

export enum FitnessGoal {
  WEIGHT_LOSS = 'weight_loss',
  MUSCLE_GAIN = 'muscle_gain',
  STRENGTH = 'strength',
  ENDURANCE = 'endurance',
  FLEXIBILITY = 'flexibility',
  GENERAL_FITNESS = 'general_fitness',
  SPORTS_PERFORMANCE = 'sports_performance'
}

export enum ExperienceLevel {
  NEW = 'new',
  SOME_EXPERIENCE = 'some_experience',
  EXPERIENCED = 'experienced',
  VERY_EXPERIENCED = 'very_experienced'
}

export enum UnitSystem {
  METRIC = 'metric',
  IMPERIAL = 'imperial'
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  reminders: boolean;
  achievements: boolean;
  weeklyReports: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'friends';
  shareProgress: boolean;
  shareAchievements: boolean;
} 