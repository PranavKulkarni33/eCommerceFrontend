import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/Interfaces/user';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-confirm-sign-up',
  templateUrl: './confirm-sign-up.component.html',
  styleUrls: ['./confirm-sign-up.component.css']
})
export class ConfirmSignUpComponent {

  user: User = {} as User;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private router : Router, private authService: AuthService){}

  confirmSignup() {
    this.authService.confirmSignUp(this.user).then(() => {
      this.router.navigate(['/customerPage']); 
    }).catch((error) => {
      alert(error); 
    });
  }

  resendCode() {
    if (!this.user.email) {
      alert("Please enter your email to resend the code.");
      return;
    }

    this.authService.resendSignUp(this.user).then(() => {
      this.successMessage = "A new verification code has been sent to your email.";
      this.errorMessage = '';
    }).catch(err => {
      this.errorMessage = "Failed to resend the code: " + err.message;
      this.successMessage = '';
    });
  }


}
