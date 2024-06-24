import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
// import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  // imports: [RouterOutlet,RouterLink,CommonModule],
  imports: [RouterOutlet, RouterLink],

  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {
  router = inject(Router);

  onLogOff() {
    localStorage.removeItem('ticketUser');
    this.router.navigateByUrl('login');
  }
}
