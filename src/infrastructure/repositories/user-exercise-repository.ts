import { UserExercise } from '../../domain/entities/user-exercise';
import { UserExerciseRepository } from '../../domain/repositories/user-exercise-repository';
import { UserExerciseModel, UserExerciseDocument } from '../database/models/user-exercise.model';

export class MongoUserExerciseRepository implements UserExerciseRepository {
  
  async create(exercise: Omit<UserExercise, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserExercise> {
    const newExercise = new UserExerciseModel(exercise);
    const savedExercise = await newExercise.save();
    return this.mapToEntity(savedExercise);
  }

  async findById(id: string): Promise<UserExercise | null> {
    const exercise = await UserExerciseModel.findById(id);
    return exercise ? this.mapToEntity(exercise) : null;
  }

  async findByUserId(userId: string): Promise<UserExercise[]> {
    const exercises = await UserExerciseModel.find({ userId }).sort({ createdAt: -1 });
    return exercises.map(exercise => this.mapToEntity(exercise));
  }

  async update(id: string, exercise: Partial<UserExercise>): Promise<UserExercise | null> {
    const updatedExercise = await UserExerciseModel.findByIdAndUpdate(
      id,
      { $set: exercise },
      { new: true, runValidators: true }
    );
    return updatedExercise ? this.mapToEntity(updatedExercise) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await UserExerciseModel.findByIdAndDelete(id);
    return result !== null;
  }

  async findByName(userId: string, name: string): Promise<UserExercise[]> {
    const exercises = await UserExerciseModel.find({
      userId,
      name: { $regex: name, $options: 'i' }
    });
    return exercises.map(exercise => this.mapToEntity(exercise));
  }

  async searchByText(userId: string, query: string): Promise<UserExercise[]> {
    const exercises = await UserExerciseModel.find({
      userId,
      name: { $regex: query, $options: 'i' }
    }).sort({ createdAt: -1 });
    
    return exercises.map(exercise => this.mapToEntity(exercise));
  }

  async findWithPagination(userId: string, page: number, limit: number): Promise<{
    exercises: UserExercise[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    
    const [exercises, total] = await Promise.all([
      UserExerciseModel.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      UserExerciseModel.countDocuments({ userId })
    ]);

    return {
      exercises: exercises.map(exercise => this.mapToEntity(exercise)),
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getUserExerciseStats(userId: string): Promise<{
    total: number;
    mostUsed: Array<{ name: string; count: number }>;
    totalSets: number;
  }> {
    const stats = await UserExerciseModel.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          totalSets: { $sum: { $size: '$sets' } },
          exercises: {
            $push: {
              name: '$name',
              setsCount: { $size: '$sets' }
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          total: 1,
          totalSets: 1,
          mostUsed: {
            $slice: [
              {
                $sortArray: {
                  input: '$exercises',
                  sortBy: { setsCount: -1 }
                }
              },
              5
            ]
          }
        }
      }
    ]);

    return stats[0] || { total: 0, totalSets: 0, mostUsed: [] };
  }

  private mapToEntity(document: UserExerciseDocument): UserExercise {
    return {
      id: (document._id as any).toString(),
      userId: document.userId,
      name: document.name,
      sets: document.sets,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt
    };
  }
} 