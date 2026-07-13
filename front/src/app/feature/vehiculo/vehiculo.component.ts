import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Vehiculo } from '../../models/vehiculo';
import { VehiculoService } from '../../services/vehiculo.service';

type TabVehiculo = 'activos' | 'eliminados';

@Component({
  selector: 'app-vehiculo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehiculo.component.html',
  styleUrl: './vehiculo.component.css'
})
export class VehiculoComponent implements OnInit {
  activos = signal<Vehiculo[]>([]);
  eliminados = signal<Vehiculo[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);
  searchQuery = signal('');
  activeTab = signal<TabVehiculo>('activos');

  isAddMode = false;
  isEditMode = false;
  editingVehiculo: Vehiculo | null = null;

  vehiculoForm: Vehiculo = { placa: '', marca: '', modelo: '', anio: null, color: '', precioPorDia: null, estado: 'DISPONIBLE' };

  filteredActivos = computed(() => {
    const q = this.searchQuery().toLowerCase();
    return this.activos().filter(v =>
      v.placa?.toLowerCase().includes(q) || v.marca?.toLowerCase().includes(q) ||
      v.modelo?.toLowerCase().includes(q) || v.id?.toString().includes(q)
    );
  });

  filteredEliminados = computed(() => {
    const q = this.searchQuery().toLowerCase();
    return this.eliminados().filter(v =>
      v.placa?.toLowerCase().includes(q) || v.marca?.toLowerCase().includes(q) ||
      v.modelo?.toLowerCase().includes(q) || v.id?.toString().includes(q)
    );
  });

  constructor(private vehiculoService: VehiculoService) {}

  async ngOnInit() {
    await this.loadAll();
  }

  async loadAll() {
    this.loading.set(true);
    try {
      const [activos, eliminados] = await Promise.all([
        this.vehiculoService.getActivos(),
        this.vehiculoService.getEliminados()
      ]);
      this.activos.set(activos);
      this.eliminados.set(eliminados);
    } catch {
      this.error.set('Error de conexión.');
    } finally { this.loading.set(false); }
  }

  setTab(tab: TabVehiculo) {
    this.activeTab.set(tab);
    this.searchQuery.set('');
    this.cancelForm();
  }

  toggleAddMode() {
    this.isAddMode = !this.isAddMode;
    this.isEditMode = false;
    this.editingVehiculo = null;
    this.vehiculoForm = { placa: '', marca: '', modelo: '', anio: null, color: '', precioPorDia: null, estado: 'DISPONIBLE' };
  }

  openEdit(v: Vehiculo) {
    this.isEditMode = true;
    this.isAddMode = false;
    this.editingVehiculo = { ...v };
  }

  cancelForm() {
    this.isAddMode = false;
    this.isEditMode = false;
    this.editingVehiculo = null;
    this.vehiculoForm = { placa: '', marca: '', modelo: '', anio: null, color: '', precioPorDia: null, estado: 'DISPONIBLE' };
  }

  private notify(msg: string, type: 'success' | 'error' = 'success') {
    if (type === 'success') { this.success.set(msg); setTimeout(() => this.success.set(null), 4000); }
    else { this.error.set(msg); setTimeout(() => this.error.set(null), 4000); }
  }

  async onSubmit(e: Event) {
    e.preventDefault();
    try {
      const saved = await this.vehiculoService.create({ ...this.vehiculoForm });
      this.activos.set([...this.activos(), saved]);
      this.cancelForm();
      this.notify('¡Vehículo registrado con éxito!');
    } catch { this.notify('Error al registrar el vehículo.', 'error'); }
  }

  async onUpdate(e: Event) {
    e.preventDefault();
    if (!this.editingVehiculo) return;
    try {
      const updated = await this.vehiculoService.update(this.editingVehiculo.id!, { ...this.editingVehiculo });
      this.activos.set(this.activos().map(v => v.id === updated.id ? updated : v));
      this.cancelForm();
      this.notify('¡Vehículo actualizado con éxito!');
    } catch { this.notify('Error al actualizar el vehículo.', 'error'); }
  }

  async onDelete(v: Vehiculo) {
    if (!confirm(`¿Eliminar el vehículo ${v.placa}? (eliminación lógica)`)) return;
    try {
      const updated = await this.vehiculoService.deactivate(v.id!);
      this.activos.set(this.activos().filter(x => x.id !== v.id));
      this.eliminados.set([...this.eliminados(), updated]);
      this.notify(`Vehículo ${v.placa} eliminado.`);
    } catch { this.notify('Error al eliminar.', 'error'); }
  }

  async onRestore(v: Vehiculo) {
    try {
      const updated = await this.vehiculoService.activate(v.id!);
      this.eliminados.set(this.eliminados().filter(x => x.id !== v.id));
      this.activos.set([...this.activos(), updated]);
      this.notify(`Vehículo ${v.placa} restaurado.`);
    } catch { this.notify('Error al restaurar.', 'error'); }
  }

  handleSearch(e: Event) { this.searchQuery.set((e.target as HTMLInputElement).value); }
}
