import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/Interfaces/user';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  user: User = { showPassword: false, shippingAddress: '' } as User;  
  confirmPassword: string = '';  
  errorMessage: string = '';  

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {

    this.authService.getUser().then((user) => {
      if (user) {
        this.router.navigate(['/customerPage']);
      }
    }).catch((err) => {
      alert(err);
    });
  }

  signup() {
    if (this.user.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match. Please try again.';
      return;
    }
    this.authService.signUp(this.user).then(() => {
      this.router.navigate(['/confirmSignUp']);
    }).catch(err => {
      this.errorMessage = err.message || 'An error occurred. Please try again.';
    });
  }

  verifyEmail(){
    this.router.navigate(['/confirmSignUp']);
  }

  goBack() {
    this.router.navigate(['/customerPage']);
  }

  
  togglePasswordVisibility() {
    this.user.showPassword = !this.user.showPassword;
  }
}