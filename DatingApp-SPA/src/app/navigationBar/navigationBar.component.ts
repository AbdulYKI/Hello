import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/Auth.service';

@Component({
  selector: 'nav-bar',
  templateUrl: './navigationBar.component.html',
  styleUrls: ['./navigationBar.component.css']
})
export class NavigationBarComponent implements OnInit {
 model: any = {};
  constructor(private authService: AuthService) { }

  ngOnInit() {
  }
  Login() {
    this.authService.Login(this.model)
    .subscribe(next => console.log('logged in'), error => console.log('error'));
  }
  LoggedIn() {
    const token = localStorage.getItem('token');
    return !!token;
  }
  LogOut() { localStorage.removeItem('token'); }

}
