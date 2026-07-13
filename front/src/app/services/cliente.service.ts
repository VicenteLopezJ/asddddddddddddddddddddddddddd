import { Injectable } from '@angular/core';
import { Cliente } from '../models/cliente';

const API_URLS = ['/clientes', 'http://localhost:8091/clientes'];

@Injectable({ providedIn: 'root' })
export class ClienteService {

  async getAll(): Promise<Cliente[]> {
    for (const url of API_URLS) {
      try {
        const res = await fetch(url);
        if (!res.ok) continue;
        const data = await res.json();
        return Array.isArray(data) ? data : data?.content ?? [];
      } catch { continue; }
    }
    return [];
  }

  async getActivos(): Promise<Cliente[]> {
    for (const url of API_URLS) {
      try {
        const res = await fetch(`${url}/activos`);
        if (!res.ok) continue;
        const data = await res.json();
        return Array.isArray(data) ? data : data?.content ?? [];
      } catch { continue; }
    }
    return [];
  }

  async getEliminados(): Promise<Cliente[]> {
    for (const url of API_URLS) {
      try {
        const res = await fetch(`${url}/eliminados`);
        if (!res.ok) continue;
        const data = await res.json();
        return Array.isArray(data) ? data : data?.content ?? [];
      } catch { continue; }
    }
    return [];
  }

  async getById(id: number): Promise<Cliente | null> {
    for (const url of API_URLS) {
      try {
        const res = await fetch(`${url}/${id}`);
        if (!res.ok) continue;
        return await res.json();
      } catch { continue; }
    }
    return null;
  }

  async getByDni(dni: string): Promise<Cliente | null> {
    for (const url of API_URLS) {
      try {
        const res = await fetch(`${url}/dni/${dni}`);
        if (!res.ok) continue;
        return await res.json();
      } catch { continue; }
    }
    return null;
  }

  async create(cliente: Cliente): Promise<Cliente> {
    for (const url of API_URLS) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cliente)
        });
        if (!res.ok) continue;
        return await res.json();
      } catch { continue; }
    }
    throw new Error('No se pudo crear el cliente');
  }

  async update(id: number, cliente: Cliente): Promise<Cliente> {
    for (const url of API_URLS) {
      try {
        const res = await fetch(`${url}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cliente)
        });
        if (!res.ok) continue;
        return await res.json();
      } catch { continue; }
    }
    throw new Error('No se pudo actualizar el cliente');
  }

  async deactivate(id: number): Promise<Cliente> {
    for (const url of API_URLS) {
      try {
        const res = await fetch(`${url}/${id}/deactivate`, { method: 'PATCH' });
        if (!res.ok) continue;
        return await res.json();
      } catch { continue; }
    }
    throw new Error('No se pudo desactivar el cliente');
  }

  async activate(id: number): Promise<Cliente> {
    for (const url of API_URLS) {
      try {
        const res = await fetch(`${url}/${id}/activate`, { method: 'PATCH' });
        if (!res.ok) continue;
        return await res.json();
      } catch { continue; }
    }
    throw new Error('No se pudo activar el cliente');
  }
}
