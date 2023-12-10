import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-dash-toolbar',
  templateUrl: './dash-toolbar.component.html',
  styleUrls: ['./dash-toolbar.component.scss']
})
export class DashToolbarComponent implements OnInit {

  navbarOpen = false;
  username: string;

  constructor(private authService: AuthService, private router: Router) {
    this.username = authService.getUsername()
  }

  logout() {
    this.router.navigate(["/"]);
    this.authService.logout();
  }

  ngOnInit(): void { }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }
}
