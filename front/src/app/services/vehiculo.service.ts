import { Injectable } from '@angular/core';
import { Vehiculo } from '../models/vehiculo';

const API_URLS = ['/vehiculos', 'http://localhost:8090/vehiculos'];

@Injectable({ providedIn: 'root' })
export class VehiculoService {

  async getAll(): Promise<Vehiculo[]> {
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

  async getActivos(): Promise<Vehiculo[]> {
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

  async getEliminados(): Promise<Vehiculo[]> {
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

  async getById(id: number): Promise<Vehiculo | null> {
    for (const url of API_URLS) {
      try {
        const res = await fetch(`${url}/${id}`);
        if (!res.ok) continue;
        return await res.json();
      } catch { continue; }
    }
    return null;
  }

  async create(vehiculo: Vehiculo): Promise<Vehiculo> {
    for (const url of API_URLS) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(vehiculo)
        });
        if (!res.ok) continue;
        return await res.json();
      } catch { continue; }
    }
    throw new Error('No se pudo crear el vehículo');
  }

  async update(id: number, vehiculo: Vehiculo): Promise<Vehiculo> {
    for (const url of API_URLS) {
      try {
        const res = await fetch(`${url}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(vehiculo)
        });
        if (!res.ok) continue;
        return await res.json();
      } catch { continue; }
    }
    throw new Error('No se pudo actualizar el vehículo');
  }

  async deactivate(id: number): Promise<Vehiculo> {
    for (const url of API_URLS) {
      try {
        const res = await fetch(`${url}/${id}/deactivate`, { method: 'PATCH' });
        if (!res.ok) continue;
        return await res.json();
      } catch { continue; }
    }
    throw new Error('No se pudo desactivar el vehículo');
  }

  async activate(id: number): Promise<Vehiculo> {
    for (const url of API_URLS) {
      try {
        const res = await fetch(`${url}/${id}/activate`, { method: 'PATCH' });
        if (!res.ok) continue;
        return await res.json();
      } catch { continue; }
    }
    throw new Error('No se pudo restaurar el vehículo');
  }

  async delete(id: number): Promise<void> {
    for (const url of API_URLS) {
      try {
        const res = await fetch(`${url}/${id}`, { method: 'DELETE' });
        if (!res.ok) continue;
        return;
      } catch { continue; }
    }
  }
}
