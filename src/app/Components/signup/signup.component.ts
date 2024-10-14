import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/Interfaces/user';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  user: User = {} as User;
  errorMessage: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  
  signup() {
    this.authService.signUp(this.user).then(() => {
      this.router.navigate(['/confirmSignUp']);
    }).catch(err => {
      alert(err);
    });
  }
  verifyEmail(){
    this.router.navigate(['/confirmSignUp'])
  }

  goBack() {
    this.router.navigate(['/login']);
  }
}
