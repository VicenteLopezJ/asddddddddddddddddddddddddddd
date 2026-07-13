import { Injectable } from '@angular/core';
import { Alquiler } from '../models/alquiler';

const API_URLS = ['/alquileres', 'http://localhost:8092/alquileres'];

@Injectable({ providedIn: 'root' })
export class AlquilerService {

  async getAll(): Promise<Alquiler[]> {
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

  async getActivos(): Promise<Alquiler[]> {
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

  async getCancelados(): Promise<Alquiler[]> {
    for (const url of API_URLS) {
      try {
        const res = await fetch(`${url}/cancelados`);
        if (!res.ok) continue;
        const data = await res.json();
        return Array.isArray(data) ? data : data?.content ?? [];
      } catch { continue; }
    }
    return [];
  }

  async getById(id: number): Promise<Alquiler | null> {
    for (const url of API_URLS) {
      try {
        const res = await fetch(`${url}/${id}`);
        if (!res.ok) continue;
        return await res.json();
      } catch { continue; }
    }
    return null;
  }

  async getByClienteId(clienteId: number): Promise<Alquiler[]> {
    for (const url of API_URLS) {
      try {
        const res = await fetch(`${url}/cliente/${clienteId}`);
        if (!res.ok) continue;
        return await res.json();
      } catch { continue; }
    }
    return [];
  }

  async create(alquiler: Alquiler): Promise<Alquiler> {
    for (const url of API_URLS) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(alquiler)
        });
        if (!res.ok) continue;
        return await res.json();
      } catch { continue; }
    }
    throw new Error('No se pudo crear el alquiler');
  }

  async update(id: number, alquiler: Alquiler): Promise<Alquiler> {
    for (const url of API_URLS) {
      try {
        const res = await fetch(`${url}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(alquiler)
        });
        if (!res.ok) continue;
        return await res.json();
      } catch { continue; }
    }
    throw new Error('No se pudo actualizar el alquiler');
  }

  async cancel(id: number): Promise<Alquiler> {
    for (const url of API_URLS) {
      try {
        const res = await fetch(`${url}/${id}/cancel`, { method: 'PATCH' });
        if (!res.ok) continue;
        return await res.json();
      } catch { continue; }
    }
    throw new Error('No se pudo cancelar el alquiler');
  }

  async restore(id: number): Promise<Alquiler> {
    for (const url of API_URLS) {
      try {
        const res = await fetch(`${url}/${id}/restore`, { method: 'PATCH' });
        if (!res.ok) continue;
        return await res.json();
      } catch { continue; }
    }
    throw new Error('No se pudo restaurar el alquiler');
  }
}
