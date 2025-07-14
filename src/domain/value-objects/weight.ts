export class Weight {
  private readonly _value: number;
  private readonly _unit: WeightUnit;

  constructor(value: number, unit: WeightUnit = WeightUnit.KG) {
    if (value < 0) {
      throw new Error('Weight cannot be negative');
    }
    if (value > 1000) {
      throw new Error('Weight cannot exceed 1000 kg');
    }
    
    this._value = value;
    this._unit = unit;
  }

  get value(): number {
    return this._value;
  }

  get unit(): WeightUnit {
    return this._unit;
  }

  // Convertir a kg
  toKg(): number {
    switch (this._unit) {
      case WeightUnit.KG:
        return this._value;
      case WeightUnit.LBS:
        return this._value * 0.453592;
      default:
        return this._value;
    }
  }

  // Convertir a lbs
  toLbs(): number {
    switch (this._unit) {
      case WeightUnit.KG:
        return this._value * 2.20462;
      case WeightUnit.LBS:
        return this._value;
      default:
        return this._value;
    }
  }

  // Crear desde kg
  static fromKg(kg: number): Weight {
    return new Weight(kg, WeightUnit.KG);
  }

  // Crear desde lbs
  static fromLbs(lbs: number): Weight {
    return new Weight(lbs, WeightUnit.LBS);
  }

  // Comparar con otro peso
  equals(other: Weight): boolean {
    return this.toKg() === other.toKg();
  }

  // Sumar pesos
  add(other: Weight): Weight {
    return Weight.fromKg(this.toKg() + other.toKg());
  }

  // Restar pesos
  subtract(other: Weight): Weight {
    const result = this.toKg() - other.toKg();
    if (result < 0) {
      throw new Error('Result cannot be negative');
    }
    return Weight.fromKg(result);
  }

  toString(): string {
    return `${this._value} ${this._unit}`;
  }
}

export enum WeightUnit {
  KG = 'kg',
  LBS = 'lbs'
} 