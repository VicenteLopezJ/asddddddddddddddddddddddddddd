import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Alquiler } from '../../models/alquiler';
import { AlquilerService } from '../../services/alquiler.service';
import { ClienteService } from '../../services/cliente.service';
import { VehiculoService } from '../../services/vehiculo.service';

type TabAlquiler = 'activos' | 'cancelados';

@Component({
  selector: 'app-alquiler',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './alquiler.component.html',
  styleUrl: './alquiler.component.css'
})
export class AlquilerComponent implements OnInit {
  activos = signal<Alquiler[]>([]);
  cancelados = signal<Alquiler[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);
  searchQuery = signal('');
  activeTab = signal<TabAlquiler>('activos');

  isAddMode = false;
  isEditMode = false;
  editingAlquiler: Alquiler | null = null;

  alquilerForm: Alquiler = { clienteId: null, vehiculoId: null, dias: null, fechaInicio: '', fechaFin: '', total: null, estado: 'ACTIVO' };

  // Maps id → nombre para lookup rápido en tarjetas
  clienteMap = new Map<number, string>();
  vehiculoMap = new Map<number, string>();

  // Preview en tiempo real mientras se escribe el ID en el form
  previewClienteAdd = signal<string | null>(null);
  previewVehiculoAdd = signal<string | null>(null);
  previewClienteEdit = signal<string | null>(null);
  previewVehiculoEdit = signal<string | null>(null);

  filteredActivos = computed(() => {
    const q = this.searchQuery().toLowerCase();
    return this.activos().filter(a =>
      a.clienteId?.toString().includes(q) || a.vehiculoId?.toString().includes(q) ||
      a.id?.toString().includes(q) || a.fechaInicio?.includes(q) ||
      this.getClienteNombre(a.clienteId).toLowerCase().includes(q) ||
      this.getVehiculoNombre(a.vehiculoId).toLowerCase().includes(q)
    );
  });

  filteredCancelados = computed(() => {
    const q = this.searchQuery().toLowerCase();
    return this.cancelados().filter(a =>
      a.clienteId?.toString().includes(q) || a.vehiculoId?.toString().includes(q) ||
      a.id?.toString().includes(q) || a.fechaInicio?.includes(q) ||
      this.getClienteNombre(a.clienteId).toLowerCase().includes(q) ||
      this.getVehiculoNombre(a.vehiculoId).toLowerCase().includes(q)
    );
  });

  constructor(
    private alquilerService: AlquilerService,
    private clienteService: ClienteService,
    private vehiculoService: VehiculoService
  ) {}

  async ngOnInit() { await this.loadAll(); }

  async loadAll() {
    this.loading.set(true);
    try {
      const [activos, cancelados, clientes, vehiculos] = await Promise.all([
        this.alquilerService.getActivos(),
        this.alquilerService.getCancelados(),
        this.clienteService.getAll(),
        this.vehiculoService.getAll()
      ]);
      this.activos.set(activos);
      this.cancelados.set(cancelados);

      // Construir Maps para lookup en tarjetas
      this.clienteMap.clear();
      clientes.forEach(c => {
        if (c.id != null) this.clienteMap.set(c.id, `${c.nombres} ${c.apellidos}`);
      });
      this.vehiculoMap.clear();
      vehiculos.forEach(v => {
        if (v.id != null) this.vehiculoMap.set(v.id, `${v.marca} ${v.modelo} (${v.placa})`);
      });
    } catch {
      this.error.set('Error de conexión.');
    } finally { this.loading.set(false); }
  }

  // Helpers para tarjetas
  getClienteNombre(id: number | null): string {
    if (id == null) return '';
    return this.clienteMap.get(id) ?? `#${id}`;
  }

  getVehiculoNombre(id: number | null): string {
    if (id == null) return '';
    return this.vehiculoMap.get(id) ?? `#${id}`;
  }

  setTab(tab: TabAlquiler) {
    this.activeTab.set(tab);
    this.searchQuery.set('');
    this.cancelForm();
  }

  toggleAddMode() {
    this.isAddMode = !this.isAddMode;
    this.isEditMode = false;
    this.editingAlquiler = null;
    this.alquilerForm = { clienteId: null, vehiculoId: null, dias: null, fechaInicio: '', fechaFin: '', total: null, estado: 'ACTIVO' };
    this.previewClienteAdd.set(null);
    this.previewVehiculoAdd.set(null);
  }

  openEdit(a: Alquiler) {
    this.isEditMode = true;
    this.isAddMode = false;
    this.editingAlquiler = { ...a };
    // Mostrar preview inmediatamente al abrir edición
    this.previewClienteEdit.set(this.getClienteNombre(a.clienteId));
    this.previewVehiculoEdit.set(this.getVehiculoNombre(a.vehiculoId));
  }

  cancelForm() {
    this.isAddMode = false;
    this.isEditMode = false;
    this.editingAlquiler = null;
    this.alquilerForm = { clienteId: null, vehiculoId: null, dias: null, fechaInicio: '', fechaFin: '', total: null, estado: 'ACTIVO' };
    this.previewClienteAdd.set(null);
    this.previewVehiculoAdd.set(null);
    this.previewClienteEdit.set(null);
    this.previewVehiculoEdit.set(null);
  }

  private notify(msg: string, type: 'success' | 'error' = 'success') {
    if (type === 'success') { this.success.set(msg); setTimeout(() => this.success.set(null), 4000); }
    else { this.error.set(msg); setTimeout(() => this.error.set(null), 4000); }
  }

  // Lookup en tiempo real al escribir ID del cliente (formulario agregar)
  async onClienteIdChangeAdd() {
    const id = this.alquilerForm.clienteId;
    if (!id) { this.previewClienteAdd.set(null); return; }
    const cached = this.clienteMap.get(id);
    if (cached) { this.previewClienteAdd.set(cached); return; }
    const c = await this.clienteService.getById(id);
    if (c) {
      const nombre = `${c.nombres} ${c.apellidos}`;
      this.clienteMap.set(id, nombre);
      this.previewClienteAdd.set(nombre);
    } else {
      this.previewClienteAdd.set('⚠️ Cliente no encontrado');
    }
  }

  // Lookup en tiempo real al escribir ID del vehículo (formulario agregar)
  async onVehiculoIdChangeAdd() {
    const id = this.alquilerForm.vehiculoId;
    if (!id) { this.previewVehiculoAdd.set(null); return; }
    const cached = this.vehiculoMap.get(id);
    if (cached) { this.previewVehiculoAdd.set(cached); return; }
    const v = await this.vehiculoService.getById(id);
    if (v) {
      const nombre = `${v.marca} ${v.modelo} (${v.placa})`;
      this.vehiculoMap.set(id, nombre);
      this.previewVehiculoAdd.set(nombre);
    } else {
      this.previewVehiculoAdd.set('⚠️ Vehículo no encontrado');
    }
  }

  // Lookup en tiempo real al escribir ID del cliente (formulario editar)
  async onClienteIdChangeEdit() {
    const id = this.editingAlquiler?.clienteId;
    if (!id) { this.previewClienteEdit.set(null); return; }
    const cached = this.clienteMap.get(id);
    if (cached) { this.previewClienteEdit.set(cached); return; }
    const c = await this.clienteService.getById(id);
    if (c) {
      const nombre = `${c.nombres} ${c.apellidos}`;
      this.clienteMap.set(id, nombre);
      this.previewClienteEdit.set(nombre);
    } else {
      this.previewClienteEdit.set('⚠️ Cliente no encontrado');
    }
  }

  // Lookup en tiempo real al escribir ID del vehículo (formulario editar)
  async onVehiculoIdChangeEdit() {
    const id = this.editingAlquiler?.vehiculoId;
    if (!id) { this.previewVehiculoEdit.set(null); return; }
    const cached = this.vehiculoMap.get(id);
    if (cached) { this.previewVehiculoEdit.set(cached); return; }
    const v = await this.vehiculoService.getById(id);
    if (v) {
      const nombre = `${v.marca} ${v.modelo} (${v.placa})`;
      this.vehiculoMap.set(id, nombre);
      this.previewVehiculoEdit.set(nombre);
    } else {
      this.previewVehiculoEdit.set('⚠️ Vehículo no encontrado');
    }
  }

  onDiasChange() {
    const form = this.isEditMode ? this.editingAlquiler! : this.alquilerForm;
    if (form.dias && form.fechaInicio) {
      const inicio = new Date(form.fechaInicio);
      const fin = new Date(inicio);
      fin.setDate(fin.getDate() + form.dias);
      form.fechaFin = fin.toISOString().split('T')[0];
    }
  }

  async onSubmit(e: Event) {
    e.preventDefault();
    try {
      const saved = await this.alquilerService.create({ ...this.alquilerForm });
      // Refrescar maps si hay IDs nuevos
      if (saved.clienteId && !this.clienteMap.has(saved.clienteId)) {
        const c = await this.clienteService.getById(saved.clienteId);
        if (c) this.clienteMap.set(saved.clienteId, `${c.nombres} ${c.apellidos}`);
      }
      if (saved.vehiculoId && !this.vehiculoMap.has(saved.vehiculoId)) {
        const v = await this.vehiculoService.getById(saved.vehiculoId);
        if (v) this.vehiculoMap.set(saved.vehiculoId, `${v.marca} ${v.modelo} (${v.placa})`);
      }
      this.activos.set([...this.activos(), saved]);
      this.cancelForm();
      this.notify('¡Alquiler registrado con éxito!');
    } catch { this.notify('Error al registrar el alquiler.', 'error'); }
  }

  async onUpdate(e: Event) {
    e.preventDefault();
    if (!this.editingAlquiler) return;
    try {
      const updated = await this.alquilerService.update(this.editingAlquiler.id!, { ...this.editingAlquiler });
      this.activos.set(this.activos().map(a => a.id === updated.id ? updated : a));
      this.cancelForm();
      this.notify('¡Alquiler actualizado con éxito!');
    } catch { this.notify('Error al actualizar el alquiler.', 'error'); }
  }

  async onCancel(a: Alquiler) {
    if (!confirm(`¿Cancelar el alquiler #${a.id}?`)) return;
    try {
      const updated = await this.alquilerService.cancel(a.id!);
      this.activos.set(this.activos().filter(x => x.id !== a.id));
      this.cancelados.set([...this.cancelados(), updated]);
      this.notify(`Alquiler #${a.id} cancelado.`);
    } catch { this.notify('Error al cancelar.', 'error'); }
  }

  async onRestore(a: Alquiler) {
    try {
      const updated = await this.alquilerService.restore(a.id!);
      this.cancelados.set(this.cancelados().filter(x => x.id !== a.id));
      this.activos.set([...this.activos(), updated]);
      this.notify(`Alquiler #${a.id} restaurado.`);
    } catch { this.notify('Error al restaurar.', 'error'); }
  }

  handleSearch(e: Event) { this.searchQuery.set((e.target as HTMLInputElement).value); }
}
