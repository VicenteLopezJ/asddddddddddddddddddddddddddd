import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Cliente } from '../../models/cliente';
import { ClienteService } from '../../services/cliente.service';

type TabCliente = 'activos' | 'eliminados';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.css'
})
export class ClienteComponent implements OnInit {
  activos = signal<Cliente[]>([]);
  eliminados = signal<Cliente[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);
  searchQuery = signal('');
  activeTab = signal<TabCliente>('activos');

  isAddMode = false;
  isEditMode = false;
  editingCliente: Cliente | null = null;

  clienteForm: Cliente = { dni: '', nombres: '', apellidos: '', celular: '', correo: '', licencia: '', estado: 'ACTIVO' };

  filteredActivos = computed(() => {
    const q = this.searchQuery().toLowerCase();
    return this.activos().filter(c =>
      c.dni?.toLowerCase().includes(q) || c.nombres?.toLowerCase().includes(q) ||
      c.apellidos?.toLowerCase().includes(q) || c.correo?.toLowerCase().includes(q)
    );
  });

  filteredEliminados = computed(() => {
    const q = this.searchQuery().toLowerCase();
    return this.eliminados().filter(c =>
      c.dni?.toLowerCase().includes(q) || c.nombres?.toLowerCase().includes(q) ||
      c.apellidos?.toLowerCase().includes(q) || c.correo?.toLowerCase().includes(q)
    );
  });

  constructor(private clienteService: ClienteService) {}

  async ngOnInit() { await this.loadAll(); }

  async loadAll() {
    this.loading.set(true);
    try {
      const [activos, eliminados] = await Promise.all([
        this.clienteService.getActivos(),
        this.clienteService.getEliminados()
      ]);
      this.activos.set(activos);
      this.eliminados.set(eliminados);
    } catch {
      this.error.set('Error de conexión.');
    } finally { this.loading.set(false); }
  }

  setTab(tab: TabCliente) {
    this.activeTab.set(tab);
    this.searchQuery.set('');
    this.cancelForm();
  }

  toggleAddMode() {
    this.isAddMode = !this.isAddMode;
    this.isEditMode = false;
    this.editingCliente = null;
    this.clienteForm = { dni: '', nombres: '', apellidos: '', celular: '', correo: '', licencia: '', estado: 'ACTIVO' };
  }

  openEdit(c: Cliente) {
    this.isEditMode = true;
    this.isAddMode = false;
    this.editingCliente = { ...c };
  }

  cancelForm() {
    this.isAddMode = false;
    this.isEditMode = false;
    this.editingCliente = null;
    this.clienteForm = { dni: '', nombres: '', apellidos: '', celular: '', correo: '', licencia: '', estado: 'ACTIVO' };
  }

  private notify(msg: string, type: 'success' | 'error' = 'success') {
    if (type === 'success') { this.success.set(msg); setTimeout(() => this.success.set(null), 4000); }
    else { this.error.set(msg); setTimeout(() => this.error.set(null), 4000); }
  }

  async onSubmit(e: Event) {
    e.preventDefault();
    try {
      const saved = await this.clienteService.create({ ...this.clienteForm });
      this.activos.set([...this.activos(), saved]);
      this.cancelForm();
      this.notify('¡Cliente registrado con éxito!');
    } catch { this.notify('Error al registrar el cliente.', 'error'); }
  }

  async onUpdate(e: Event) {
    e.preventDefault();
    if (!this.editingCliente) return;
    try {
      const updated = await this.clienteService.update(this.editingCliente.id!, { ...this.editingCliente });
      this.activos.set(this.activos().map(c => c.id === updated.id ? updated : c));
      this.cancelForm();
      this.notify('¡Cliente actualizado con éxito!');
    } catch { this.notify('Error al actualizar el cliente.', 'error'); }
  }

  async onDelete(c: Cliente) {
    if (!confirm(`¿Eliminar al cliente ${c.nombres} ${c.apellidos}? (eliminación lógica)`)) return;
    try {
      const updated = await this.clienteService.deactivate(c.id!);
      this.activos.set(this.activos().filter(x => x.id !== c.id));
      this.eliminados.set([...this.eliminados(), updated]);
      this.notify(`Cliente ${c.nombres} eliminado.`);
    } catch { this.notify('Error al eliminar.', 'error'); }
  }

  async onRestore(c: Cliente) {
    try {
      const updated = await this.clienteService.activate(c.id!);
      this.eliminados.set(this.eliminados().filter(x => x.id !== c.id));
      this.activos.set([...this.activos(), updated]);
      this.notify(`Cliente ${c.nombres} restaurado.`);
    } catch { this.notify('Error al restaurar.', 'error'); }
  }

  handleSearch(e: Event) { this.searchQuery.set((e.target as HTMLInputElement).value); }
}
