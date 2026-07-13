import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent, ActiveTab } from './layout/navbar/navbar.component';
import { VehiculoComponent } from './feature/vehiculo/vehiculo.component';
import { ClienteComponent } from './feature/cliente/cliente.component';
import { AlquilerComponent } from './feature/alquiler/alquiler.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NavbarComponent, VehiculoComponent, ClienteComponent, AlquilerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  activeTab = signal<ActiveTab>('vehiculo');

  setTab(tab: ActiveTab) {
    this.activeTab.set(tab);
  }
}
