export interface Alquiler {
  id?: number;
  clienteId: number | null;
  vehiculoId: number | null;
  dias: number | null;
  fechaInicio: string;
  fechaFin: string;
  total: number | null;
  estado: string;
}
