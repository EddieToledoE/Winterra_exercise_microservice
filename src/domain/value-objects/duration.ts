export class Duration {
  private readonly _seconds: number;

  constructor(seconds: number) {
    if (seconds < 0) {
      throw new Error('Duration cannot be negative');
    }
    if (seconds > 86400) { // 24 horas en segundos
      throw new Error('Duration cannot exceed 24 hours');
    }
    
    this._seconds = seconds;
  }

  get seconds(): number {
    return this._seconds;
  }

  get minutes(): number {
    return this._seconds / 60;
  }

  get hours(): number {
    return this._seconds / 3600;
  }

  // Crear desde segundos
  static fromSeconds(seconds: number): Duration {
    return new Duration(seconds);
  }

  // Crear desde minutos
  static fromMinutes(minutes: number): Duration {
    return new Duration(minutes * 60);
  }

  // Crear desde horas
  static fromHours(hours: number): Duration {
    return new Duration(hours * 3600);
  }

  // Crear desde formato MM:SS
  static fromTimeString(timeString: string): Duration {
    const parts = timeString.split(':');
    if (parts.length !== 2) {
      throw new Error('Invalid time format. Use MM:SS');
    }
    
    const minutes = parseInt(parts[0] || '0', 10);
    const seconds = parseInt(parts[1] || '0', 10);
    
    if (isNaN(minutes) || isNaN(seconds)) {
      throw new Error('Invalid time format');
    }
    
    return new Duration(minutes * 60 + seconds);
  }

  // Sumar duraciones
  add(other: Duration): Duration {
    return Duration.fromSeconds(this._seconds + other._seconds);
  }

  // Restar duraciones
  subtract(other: Duration): Duration {
    const result = this._seconds - other._seconds;
    if (result < 0) {
      throw new Error('Result cannot be negative');
    }
    return Duration.fromSeconds(result);
  }

  // Comparar duraciones
  equals(other: Duration): boolean {
    return this._seconds === other._seconds;
  }

  // Verificar si es mayor que otra duración
  isGreaterThan(other: Duration): boolean {
    return this._seconds > other._seconds;
  }

  // Verificar si es menor que otra duración
  isLessThan(other: Duration): boolean {
    return this._seconds < other._seconds;
  }

  // Formatear como MM:SS
  toTimeString(): string {
    const minutes = Math.floor(this._seconds / 60);
    const seconds = this._seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  // Formatear como texto legible
  toReadableString(): string {
    const hours = Math.floor(this._seconds / 3600);
    const minutes = Math.floor((this._seconds % 3600) / 60);
    const seconds = this._seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  }

  toString(): string {
    return this.toTimeString();
  }
} 