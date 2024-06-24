import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  // imports: [RouterOutlet, BrowserModule,CommonModule],
  imports: [RouterOutlet, CommonModule],

  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'ticket_tool_angular_18';
}
