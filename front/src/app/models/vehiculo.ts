export interface Vehiculo {
  id?: number;
  placa: string;
  marca: string;
  modelo: string;
  anio: number | null;
  color: string;
  precioPorDia: number | null;
  estado: string;
}
