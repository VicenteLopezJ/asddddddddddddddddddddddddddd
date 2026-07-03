import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Vehiculo } from './models/vehiculo';

const API_VEHICULOS_URLS = [
  '/api/vehiculos',
  '/vehiculos'
];

const DEMO_VEHICULOS: Vehiculo[] = [
  {
    id: 1,
    placa: 'ABC-123',
    marca: 'Toyota',
    modelo: 'Corolla',
    anio: 2022,
    color: 'Blanco',
    precioPorDia: 45,
    estado: true
  },
  {
    id: 2,
    placa: 'XYZ-789',
    marca: 'Honda',
    modelo: 'Civic',
    anio: 2021,
    color: 'Negro',
    precioPorDia: 50,
    estado: false
  }
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  vehiculos = signal<Vehiculo[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  searchQuery = signal('');
  selectedVehiculoId = 0;
  selectedVehiculo: Vehiculo | null = null;
  isAddMode = false;

  vehiculoForm: Vehiculo = {
    placa: '',
    marca: '',
    modelo: '',
    anio: null,
    color: '',
    precioPorDia: null,
    estado: true
  };

  filteredVehiculos = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.vehiculos().filter(v =>
      v.placa?.toLowerCase().includes(query) ||
      v.marca?.toLowerCase().includes(query) ||
      v.modelo?.toLowerCase().includes(query) ||
      v.color?.toLowerCase().includes(query) ||
      v.id?.toString().includes(query)
    );
  });

  constructor() {
    this.fetchVehiculos();
  }

  handleSearch(e: Event) {
    const target = e.target as HTMLInputElement;
    this.searchQuery.set(target.value);
  }

  toggleAddMode() {
    this.isAddMode = !this.isAddMode;
  }

  selectVehiculo(v: Vehiculo) {
    this.isAddMode = false;
    this.selectedVehiculo = v;
    this.selectedVehiculoId = v.id ?? 0;
  }

  private showNotification(msg: string, type: 'success' | 'error' = 'success') {
    if (type === 'success') {
      this.success.set(msg);
      setTimeout(() => this.success.set(null), 4000);
    } else {
      this.error.set(msg);
      setTimeout(() => this.error.set(null), 4000);
    }
  }

  async fetchVehiculos() {
    this.loading.set(true);
    try {
      for (const url of API_VEHICULOS_URLS) {
        try {
          const res = await fetch(url);
          if (!res.ok) continue;
          const data = await res.json();
          this.vehiculos.set(Array.isArray(data) ? data : data?.content ?? []);
          this.error.set(null);
          return;
        } catch {
          continue;
        }
      }

      this.vehiculos.set(DEMO_VEHICULOS);
      this.error.set('No se encontró un backend disponible. Se muestran datos de ejemplo.');
    } catch {
      this.error.set('No se pudo conectar con el microservicio de Vehículos.');
    } finally {
      this.loading.set(false);
    }
  }

  async createVehiculo(e: Event) {
    e.preventDefault();

    const newVehiculo: Vehiculo = {
      id: Date.now(),
      placa: this.vehiculoForm.placa,
      marca: this.vehiculoForm.marca,
      modelo: this.vehiculoForm.modelo,
      anio: this.vehiculoForm.anio ? Number(this.vehiculoForm.anio) : null,
      color: this.vehiculoForm.color,
      precioPorDia: this.vehiculoForm.precioPorDia ? Number(this.vehiculoForm.precioPorDia) : null,
      estado: Boolean(this.vehiculoForm.estado)
    };

    try {
      for (const url of API_VEHICULOS_URLS) {
        try {
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newVehiculo)
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Error');
          }

          const savedVehiculo = await res.json();
          this.vehiculos.set([...this.vehiculos(), savedVehiculo]);
          this.isAddMode = false;
          this.selectVehiculo(savedVehiculo);
          this.vehiculoForm = {
            placa: '',
            marca: '',
            modelo: '',
            anio: null,
            color: '',
            precioPorDia: null,
            estado: true
          };
          this.showNotification('¡Vehículo registrado con éxito!');
          return;
        } catch {
          continue;
        }
      }

      this.vehiculos.set([...this.vehiculos(), newVehiculo]);
      this.isAddMode = false;
      this.selectVehiculo(newVehiculo);
      this.vehiculoForm = {
        placa: '',
        marca: '',
        modelo: '',
        anio: null,
        color: '',
        precioPorDia: null,
        estado: true
      };
      this.showNotification('El backend no responde. Se guardó localmente en esta sesión.', 'error');
    } catch (err: any) {
      this.showNotification(err.message || 'Error al registrar el vehículo.', 'error');
    }
  }

  async deleteVehiculo(id: number) {
    if (!confirm('¿Estás seguro de eliminar este vehículo?')) return;
    try {
      for (const url of API_VEHICULOS_URLS) {
        try {
          const res = await fetch(`${url}/${id}`, { method: 'DELETE' });
          if (!res.ok) continue;
          this.vehiculos.set(this.vehiculos().filter(v => v.id !== id));
          this.selectedVehiculo = null;
          this.selectedVehiculoId = 0;
          this.showNotification('Vehículo eliminado.');
          return;
        } catch {
          continue;
        }
      }

      this.vehiculos.set(this.vehiculos().filter(v => v.id !== id));
      this.selectedVehiculo = null;
      this.selectedVehiculoId = 0;
      this.showNotification('El backend no responde. Se eliminó localmente en esta sesión.', 'error');
    } catch {
      this.showNotification('No se pudo eliminar el vehículo.', 'error');
    }
  }
}
