export type Institucion = {
  id: string;
  nombre: string;
  tipo: string;
  zona: string;
  familias: number;
  despachos: number;
};

export type Despacho = {
  id: string;
  institucion: string;
  contenido: string;
  kg: number;
  fecha: string;
  estado: "Preparación" | "En camino" | "Entregado" | "Confirmado";
};

export type Familia = {
  id: string;
  jefe: string;
  integrantes: number;
  menores: number;
  condicion: string;
  institucion: string;
};

export type Medicion = { fecha: string; peso: number; talla: number; pb: number; obs?: string };
export type Nino = {
  id: string;
  nombre: string;
  edadMeses: number;
  sexo: "F" | "M";
  familia: string;
  estado: "Normal" | "Riesgo" | "Crítico";
  zScore: number;
  mediciones: Medicion[];
};

export const instituciones: Institucion[] = [
  { id: "I-01", nombre: "Parroquia San Judas", tipo: "Parroquia", zona: "Comuna 3", familias: 42, despachos: 18 },
  { id: "I-02", nombre: "Fundación Manos Unidas", tipo: "Fundación", zona: "Comuna 8", familias: 67, despachos: 24 },
  { id: "I-03", nombre: "Comunidad Madre Laura", tipo: "Religiosa", zona: "Bello", familias: 31, despachos: 12 },
  { id: "I-04", nombre: "Centro Comunitario El Salado", tipo: "Comunitaria", zona: "Itagüí", familias: 55, despachos: 21 },
  { id: "I-05", nombre: "Parroquia La Candelaria", tipo: "Parroquia", zona: "Centro", familias: 38, despachos: 16 },
  { id: "I-06", nombre: "Fundación Semillas de Vida", tipo: "Fundación", zona: "Aranjuez", familias: 49, despachos: 19 },
];

export const despachos: Despacho[] = [
  { id: "D-2240", institucion: "Parroquia San Judas", contenido: "Mercado nutricional · 35 mercados", kg: 420, fecha: "2026-05-26", estado: "Confirmado" },
  { id: "D-2241", institucion: "Fundación Manos Unidas", contenido: "Leche infantil · BIK", kg: 180, fecha: "2026-05-27", estado: "Entregado" },
  { id: "D-2242", institucion: "Comunidad Madre Laura", contenido: "Frutas y verduras", kg: 240, fecha: "2026-05-27", estado: "En camino" },
  { id: "D-2243", institucion: "Centro Comunitario El Salado", contenido: "Granos y proteína", kg: 320, fecha: "2026-05-28", estado: "Preparación" },
  { id: "D-2244", institucion: "Parroquia La Candelaria", contenido: "Mercado nutricional · 28 mercados", kg: 336, fecha: "2026-05-28", estado: "En camino" },
  { id: "D-2245", institucion: "Fundación Semillas de Vida", contenido: "Cereales y panadería", kg: 210, fecha: "2026-05-28", estado: "Preparación" },
];

export const familias: Familia[] = [
  { id: "F-001", jefe: "María Restrepo", integrantes: 5, menores: 2, condicion: "Gestante", institucion: "Parroquia San Judas" },
  { id: "F-002", jefe: "Carlos Ospina", integrantes: 4, menores: 1, condicion: "Desplazada", institucion: "Fundación Manos Unidas" },
  { id: "F-003", jefe: "Ana Patricia Gil", integrantes: 6, menores: 3, condicion: "—", institucion: "Comunidad Madre Laura" },
  { id: "F-004", jefe: "Luz Marina Cano", integrantes: 3, menores: 1, condicion: "Discapacidad", institucion: "Centro Comunitario El Salado" },
  { id: "F-005", jefe: "Jorge Vargas", integrantes: 5, menores: 2, condicion: "Adulto mayor", institucion: "Parroquia La Candelaria" },
  { id: "F-006", jefe: "Diana Henao", integrantes: 4, menores: 2, condicion: "Gestante", institucion: "Fundación Semillas de Vida" },
];

const mkMediciones = (base: { fecha: string; peso: number; talla: number; pb: number; obs?: string }[]) => base;

export const ninos: Nino[] = [
  {
    id: "N-001", nombre: "Sofía R.", edadMeses: 14, sexo: "F", familia: "F-001",
    estado: "Normal", zScore: -0.4,
    mediciones: mkMediciones([
      { fecha: "2026-01-12", peso: 8.4, talla: 73, pb: 14.2 },
      { fecha: "2026-02-15", peso: 8.7, talla: 74, pb: 14.4 },
      { fecha: "2026-03-18", peso: 9.0, talla: 75, pb: 14.6 },
      { fecha: "2026-04-22", peso: 9.3, talla: 76, pb: 14.8 },
      { fecha: "2026-05-20", peso: 9.6, talla: 77, pb: 15.0, obs: "Buen progreso" },
    ]),
  },
  {
    id: "N-002", nombre: "Mateo C.", edadMeses: 28, sexo: "M", familia: "F-002",
    estado: "Riesgo", zScore: -1.8,
    mediciones: mkMediciones([
      { fecha: "2026-01-10", peso: 10.2, talla: 84, pb: 13.5 },
      { fecha: "2026-02-12", peso: 10.3, talla: 84.5, pb: 13.4 },
      { fecha: "2026-03-14", peso: 10.3, talla: 85, pb: 13.4, obs: "Sin ganancia de peso" },
      { fecha: "2026-04-16", peso: 10.4, talla: 85.5, pb: 13.3 },
      { fecha: "2026-05-18", peso: 10.6, talla: 86, pb: 13.5, obs: "Refuerzo nutricional" },
    ]),
  },
  {
    id: "N-003", nombre: "Valentina G.", edadMeses: 8, sexo: "F", familia: "F-003",
    estado: "Crítico", zScore: -2.7,
    mediciones: mkMediciones([
      { fecha: "2026-02-01", peso: 5.8, talla: 64, pb: 11.8, obs: "Ingreso al programa" },
      { fecha: "2026-03-05", peso: 5.9, talla: 65, pb: 11.7 },
      { fecha: "2026-04-07", peso: 6.0, talla: 65.5, pb: 11.6, obs: "Remisión a centro de salud" },
      { fecha: "2026-05-10", peso: 6.2, talla: 66, pb: 11.8 },
      { fecha: "2026-05-25", peso: 6.4, talla: 66.5, pb: 12.0, obs: "Inicia recuperación" },
    ]),
  },
  {
    id: "N-004", nombre: "Tomás C.", edadMeses: 36, sexo: "M", familia: "F-004",
    estado: "Normal", zScore: -0.1,
    mediciones: mkMediciones([
      { fecha: "2026-01-09", peso: 13.8, talla: 94, pb: 15.2 },
      { fecha: "2026-02-13", peso: 14.0, talla: 94.5, pb: 15.3 },
      { fecha: "2026-03-15", peso: 14.2, talla: 95, pb: 15.4 },
      { fecha: "2026-04-19", peso: 14.5, talla: 95.5, pb: 15.5 },
      { fecha: "2026-05-21", peso: 14.7, talla: 96, pb: 15.6 },
    ]),
  },
  {
    id: "N-005", nombre: "Isabella V.", edadMeses: 22, sexo: "F", familia: "F-005",
    estado: "Riesgo", zScore: -1.6,
    mediciones: mkMediciones([
      { fecha: "2026-01-11", peso: 9.6, talla: 80, pb: 13.6 },
      { fecha: "2026-02-14", peso: 9.7, talla: 80.5, pb: 13.5 },
      { fecha: "2026-03-16", peso: 9.8, talla: 81, pb: 13.4 },
      { fecha: "2026-04-20", peso: 10.0, talla: 81.5, pb: 13.5 },
      { fecha: "2026-05-22", peso: 10.2, talla: 82, pb: 13.6, obs: "Bajo aporte calórico" },
    ]),
  },
  {
    id: "N-006", nombre: "Samuel H.", edadMeses: 11, sexo: "M", familia: "F-006",
    estado: "Normal", zScore: 0.2,
    mediciones: mkMediciones([
      { fecha: "2026-01-13", peso: 8.0, talla: 71, pb: 14.0 },
      { fecha: "2026-02-16", peso: 8.3, talla: 72, pb: 14.2 },
      { fecha: "2026-03-19", peso: 8.6, talla: 73, pb: 14.4 },
      { fecha: "2026-04-23", peso: 9.0, talla: 74, pb: 14.6 },
      { fecha: "2026-05-24", peso: 9.3, talla: 75, pb: 14.8 },
    ]),
  },
];

export const despachosPorMes = [
  { mes: "Dic", v: 142 },
  { mes: "Ene", v: 168 },
  { mes: "Feb", v: 155 },
  { mes: "Mar", v: 182 },
  { mes: "Abr", v: 197 },
  { mes: "May", v: 218 },
];
