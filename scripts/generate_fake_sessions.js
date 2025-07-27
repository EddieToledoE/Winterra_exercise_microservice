const EJSON = require('mongodb-extended-json');
// Script para generar sesiones fake para ML
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Rutina semanal base con pesos reales y grupo muscular
const rutina = [
  {
    dia: 'LUNES', tipo: 'UPPER (ENFOQUE PECHO)', ejercicios: [
      { nombre: 'PRESS DE BANCA INCLINADA', sets: 2, peso: 30, grupo: 'PECHO' },
      { nombre: 'PRESS MILITAR', sets: 2, peso: 107, grupo: 'HOMBRO' },
      { nombre: 'PECK DECK', sets: 2, peso: 75, grupo: 'PECHO' },
      { nombre: 'REMO EN MAQUINA', sets: 2, peso: 50, grupo: 'ESPALDA' },
      { nombre: 'EXTENSION DE TRICEP', sets: 2, peso: 75, grupo: 'TRICEP' },
      { nombre: 'PREDICADOR', sets: 2, peso: 32, grupo: 'BICEP' },
      { nombre: 'CABLE CRUZADO PARA HOMBRO POSTERIOR', sets: 2, peso: 7, grupo: 'HOMBRO POSTERIOR' },
      { nombre: 'ELEVACIONES LATERALES CON MANCUERNA', sets: 3, peso: 10, grupo: 'HOMBRO LATERAL' },
    ]
  },
  {
    dia: 'MARTES', tipo: 'LOWER', ejercicios: [
      { nombre: 'HACK MACHINE', sets: 3, peso: 90, grupo: 'CUADRICEP' },
      { nombre: 'MAQUINA PARA ISQUIOTIBIALES ACOSTADO', sets: 3, peso: 64, grupo: 'ISQUIOS' },
      { nombre: 'HIP THRUST', sets: 3, peso: 200, grupo: 'GLUTEO' },
      { nombre: 'EXTENSION DE CUADRICEP', sets: 3, peso: 100, grupo: 'CUADRICEP' },
      { nombre: 'PANTORRILLA CON MANCUERNA', sets: 3, peso: 35, grupo: 'PANTORRILLA' },
      { nombre: 'ABDOMINALES', sets: 2, peso: 10, grupo: 'ABDOMINALES' },
      { nombre: 'ANTEBRAZOS NYAS', sets: 3, peso: 70, grupo: 'ANTEBRAZOS' },
    ]
  },
  {
    dia: 'JUEVES', tipo: 'PULL', ejercicios: [
      { nombre: 'JALON AL PECHO CON AGARRE CERRADO', sets: 2, peso: 75, grupo: 'ESPALDA' },
      { nombre: 'REMO EN POLEA SENTADO', sets: 2, peso: 65, grupo: 'ESPALDA' },
      { nombre: 'REMO EN MAQUINA', sets: 2, peso: 50, grupo: 'ESPALDA' },
      { nombre: 'CABLE CRUZADO PARA HOMBRO POSTERIOR', sets: 2, peso: 7, grupo: 'HOMBRO POSTERIOR' },
      { nombre: 'PREDICADOR', sets: 2, peso: 32, grupo: 'BICEP' },
      { nombre: 'CURL MARTILLO UNILATERAL EN POLEA', sets: 2, peso: 16, grupo: 'BICEP' },
      { nombre: 'ANTEBRAZO NYAS', sets: 3, peso: 70, grupo: 'ANTEBRAZOS' },
    ]
  },
  {
    dia: 'MIERCOLES', tipo: 'PUSH', ejercicios: [
      { nombre: 'PRESS DE BANCA INCLINADA', sets: 2, peso: 30, grupo: 'PECHO' },
      { nombre: 'PRESS DE BANCA PLANA', sets: 2, peso: 35, grupo: 'PECHO' },
      { nombre: 'PECK DECK', sets: 2, peso: 75, grupo: 'PECHO' },
      { nombre: 'EXTENSION DE TRICEP', sets: 2, peso: 75, grupo: 'TRICEP' },
      { nombre: 'ROMPECRANEOS', sets: 2, peso: 32, grupo: 'TRICEP' },
      { nombre: 'ELEVACIONES LATERALES CON POLEA', sets: 2, peso: 10, grupo: 'HOMBRO LATERAL' },
      { nombre: 'ELEVACIONES LATEALES CON MANCUERNAS', sets: 2, peso: 10, grupo: 'HOMBRO LATERAL' },
    ]
  },
  {
    dia: 'VIERNES', tipo: 'LOWER', ejercicios: [
      { nombre: 'PRENSA DE CUADRICEPS', sets: 3, peso: 150, grupo: 'CUADRICEP' },
      { nombre: 'PESO MUERTO RUMANO CON MANCUERNAS', sets: 3, peso: 30, grupo: 'ISQUIOS' },
      { nombre: 'HIP THRUST', sets: 3, peso: 200, grupo: 'GLUTEO' },
      { nombre: 'EXTENSION DE CUADRICEP', sets: 3, peso: 100, grupo: 'CUADRICEP' },
      { nombre: 'PANTORRILLA CON MANCUERNA', sets: 3, peso: 35, grupo: 'PANTORRILLA' },
      { nombre: 'ABDOMINALES', sets: 2, peso: 10, grupo: 'ABDOMINALES' },
    ]
  },
  {
    dia: 'SABADO', tipo: 'UPPER (ENFOQUE ESPALDA)', ejercicios: [
      { nombre: 'PRESS DE BANCA INCLINADA', sets: 2, peso: 30, grupo: 'PECHO' },
      { nombre: 'PECK DECK', sets: 2, peso: 75, grupo: 'PECHO' },
      { nombre: 'JALON AL PECHO CON AGARRE CERRADO', sets: 2, peso: 60, grupo: 'ESPALDA' },
      { nombre: 'EXTENSION DE TRICEP', sets: 2, peso: 75, grupo: 'TRICEP' },
      { nombre: 'REMO EN MAQUINA', sets: 2, peso: 50, grupo: 'ESPALDA' },
      { nombre: 'CABLE CRUZADO PARA HOMBRO POSTERIOR', sets: 2, peso: 7, grupo: 'HOMBRO POSTERIOR' },
      { nombre: 'PREDICADOR', sets: 2, peso: 32, grupo: 'BICEP' },
      { nombre: 'ELEVACIONES LATERALES EN POLEA', sets: 3, peso: 10, grupo: 'HOMBRO LATERAL' },
    ]
  }
];

const usuarios = [
  'user1',
  'user2',
  'user3'
];

const semanas = 4; // Número de semanas a simular
const progresoSemanal = 0.025; // 2.5% de progreso semanal
const variacionPesoSet = 0.02; // 2% de variación por set
const repeticionesBase = 10;
const tiempoSetActivoMin = 60; // segundos activos por set (mínimo)
const tiempoSetActivoMax = 120; // segundos activos por set (máximo)
const tiempoSetTotalMin = 300; // 5 minutos por set (mínimo)
const tiempoSetTotalMax = 330; // 5.5 minutos por set (máximo)

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function redondearPeso(peso) {
  // Redondea al múltiplo de 2.5 más cercano
  return Math.round(peso / 2.5) * 2.5;
}

function generarSets(numSets, pesoBaseSemana, grupo) {
  // Lógica realista para repeticiones y peso por set
  let sets = [];
  let prevReps = repeticionesBase + randomInt(-1, 2);
  let prevPeso = redondearPeso(pesoBaseSemana);
  for (let i = 0; i < numSets; i++) {
    const tiempoTotalSet = randomInt(tiempoSetTotalMin, tiempoSetTotalMax); // 5-5.5 min
    const tiempoActivo = randomInt(tiempoSetActivoMin, tiempoSetActivoMax); // 1-2 min
    const restTime = tiempoTotalSet - tiempoActivo;
    let reps, peso;
    if (numSets === 2) {
      if (i === 0) {
        reps = prevReps;
        peso = prevPeso;
      } else {
        // Segundo set: reps igual o menor, peso igual o mayor
        reps = prevReps - randomInt(0, 2); // puede ser igual o bajar hasta 2
        if (reps < 1) reps = 1;
        // Incremento de peso: 0, 2.5 o 5 kg
        const incremento = [0, 2.5, 5][randomInt(0, 2)];
        peso = redondearPeso(prevPeso + incremento);
        // Nunca reps < prevReps y peso < prevPeso
        if (reps < prevReps && peso < prevPeso) peso = prevPeso;
      }
    } else if (numSets === 3) {
      if (i === 0) {
        reps = prevReps;
        peso = prevPeso;
      } else {
        // Peso sube o se mantiene, reps bajan o se mantienen
        reps = sets[i-1].reps - randomInt(0, 2); // igual o baja
        if (reps < 1) reps = 1;
        // Incremento de peso: 0, 2.5 o 5 kg
        const incremento = [0, 2.5, 5][randomInt(0, 2)];
        peso = redondearPeso(sets[i-1].weight + incremento);
        // Nunca reps < prev y peso < prev
        if (reps < sets[i-1].reps && peso < sets[i-1].weight) peso = sets[i-1].weight;
      }
    } else {
      // Para sets > 3, comportamiento similar al de 3 sets
      reps = prevReps - randomInt(0, 2);
      if (reps < 1) reps = 1;
      const incremento = [0, 2.5, 5][randomInt(0, 2)];
      peso = redondearPeso(prevPeso + incremento);
      if (reps < prevReps && peso < prevPeso) peso = prevPeso;
    }
    sets.push({
      id: uuidv4(),
      reps,
      weight: peso,
      restTime,
      completed: true
    });
    prevReps = reps;
    prevPeso = peso;
  }
  return sets;
}

function calcularEstadisticas(ejercicios) {
  const setsByMuscleGroup = {};
  let totalCompletedSets = 0;
  let totalRestTime = 0;
  ejercicios.forEach(ej => {
    setsByMuscleGroup[ej.muscleGroup] = (setsByMuscleGroup[ej.muscleGroup] || 0) + ej.sets.length;
    totalCompletedSets += ej.sets.length;
    totalRestTime += ej.sets.reduce((acc, s) => acc + s.restTime, 0);
  });
  return { setsByMuscleGroup, totalCompletedSets, totalRestTime };
}

const sesiones = [];
const hoy = new Date();

usuarios.forEach((userId, idx) => {
  for (let semana = 0; semana < semanas; semana++) {
    rutina.forEach((diaRutina, diaIdx) => {
      // Calcular pesos progresivos para cada ejercicio de la semana
      const ejerciciosSemana = diaRutina.ejercicios.map(ej => {
        const pesoBaseSemana = redondearPeso(ej.peso * Math.pow(1 + progresoSemanal, semana));
        return { ...ej, pesoBaseSemana };
      });

      // Fecha de la sesión
      const fechaSesion = new Date(hoy);
      fechaSesion.setDate(hoy.getDate() - (semanas - semana - 1) * 7 - (6 - diaIdx));
      fechaSesion.setHours(7 + idx, 0, 0, 0); // Simular hora de inicio diferente por usuario
      const startTime = new Date(fechaSesion);

      // Generar ejercicios y calcular tiempos
      let totalSets = 0;
      let totalRestTime = 0;
      let totalDuration = 0;
      const ejercicios = ejerciciosSemana.map((ej, i) => {
        const sets = generarSets(ej.sets, ej.pesoBaseSemana, ej.grupo);
        totalSets += sets.length;
        totalRestTime += sets.reduce((acc, s) => acc + s.restTime, 0);
        totalDuration += sets.reduce((acc, s) => acc + s.restTime, 0); // Suma descansos
        totalDuration += sets.length * randomInt(tiempoSetActivoMin, tiempoSetActivoMax); // Suma tiempo activo
        return {
          id: uuidv4(),
          name: ej.nombre,
          muscleGroup: ej.grupo,
          sets,
          order: i + 1
        };
      });

      // Calcular endTime
      const endTime = new Date(startTime.getTime() + totalDuration * 1000);

      // Estadísticas
      const statistics = calcularEstadisticas(ejercicios);

      sesiones.push({
        userId,
        date: startTime.toISOString(),
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        totalDuration: Math.round(totalDuration),
        totalRestTime: Math.round(totalRestTime),
        totalSets,
        exercises: ejercicios,
        statistics,
        notes: '',
        createdAt: endTime.toISOString(),
        updatedAt: endTime.toISOString()
      });
    });
  }
});
fs.writeFileSync('sessions_fake.json', EJSON.stringify(sesiones, null, 2));
console.log('¡Dataset generado en sessions_fake.json con lógica realista de repeticiones y peso por set!'); 