import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ActiveTab = 'vehiculo' | 'cliente' | 'alquiler';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  @Input() activeTab: ActiveTab = 'vehiculo';
  @Output() tabChange = new EventEmitter<ActiveTab>();

  setTab(tab: ActiveTab) {
    this.tabChange.emit(tab);
  }
}
