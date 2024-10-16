import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/Interfaces/user';
import { AuthService } from 'src/app/Services/auth.service';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: User = {} as User;
  errorMessage: string = '';
  resetEmail: string = '';  
  resetCode: string = '';   
  newPassword: string = ''; 
  isPasswordResetStep2: boolean = false; 

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
   
    this.authService.getUser().then((user) => {
      if (user) {
        this.router.navigate(['/customerPage']); 
      }
    }).catch((err) => {
      console.error(err);
    });
  }

  login() {
    this.authService.login(this.user).then(() => {
      this.authService.getRole().then((role) => {
        if (role === 'Customer') {
          this.router.navigate(['/customerPage']);
        } else if (role === 'Admin') {
          this.router.navigate(['/adminPage']);
        }
      });
    }).catch(err => {
      alert(err.message || 'Login failed.');
    });
  }


  openForgotPasswordModal(event: Event) {
    event.preventDefault();
    const modalElement = document.getElementById('forgotPasswordModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  
  sendPasswordResetCode() {
    if (!this.resetEmail) {
      alert('Please enter your email.');
      return;
    }
    this.authService.forgotPassword(this.resetEmail).then(() => {
      alert('Password reset code has been sent to your email.');
      this.isPasswordResetStep2 = true; 
    }).catch(err => {
      alert(err.message || 'Error sending password reset code.');
    });
  }

  
  confirmResetPassword() {
    if (!this.resetCode || !this.newPassword) {
      alert('Please enter both the reset code and your new password.');
      return;
    }
    this.authService.confirmResetPassword(this.resetEmail, this.resetCode, this.newPassword).then(() => {
      alert('Password successfully reset!');
      this.isPasswordResetStep2 = false; 
      const modalElement = document.getElementById('forgotPasswordModal');
      if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal?.hide(); 
      }
    }).catch(err => {
      alert(err.message || 'Error resetting password.');
    });
  }

  goBackToLogin() {
    this.isPasswordResetStep2 = false;  
  }
}
