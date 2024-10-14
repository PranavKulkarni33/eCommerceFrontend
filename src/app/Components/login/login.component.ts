import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/Interfaces/user';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  user: User = {} as User;
  errorMessage: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  login(){
    this.authService.login(this.user).then(() => {
      this.router.navigate(['/customerPage']);
    }).catch(err => {
      alert(err);
    });
  }

}
