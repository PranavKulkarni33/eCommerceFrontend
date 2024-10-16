import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/Interfaces/user';
import { AuthService } from 'src/app/Services/auth.service';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-customer-page',
  templateUrl: './customer-page.component.html',
  styleUrls: ['./customer-page.component.css']
})
export class CustomerPageComponent implements OnInit {
  user: User = {} as User;
  oldPassword: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';
  isLoggedIn = false;  // Track the login status
  dropdownOpen = false;  // Track the dropdown state
  showOldPassword = false;
  showNewPassword = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Check if the user is authenticated
    this.authService.getUser().then((user) => {
      if (user) {
        this.user = user.attributes;
        this.isLoggedIn = true;  // User is logged in
      } else {
        this.isLoggedIn = false;  // User is not logged in
      }
    }).catch(() => {
      this.isLoggedIn = false;  // Handle cases where user isn't logged in
    });
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  openEditProfileModal(event: Event) {
    event.preventDefault();  // Prevent default link behavior
    const modalElement = document.getElementById('editProfileModal');
    if (modalElement) {  // Check if the element exists
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    } else {
      console.error('Modal element not found!');
    }
  }

  toggleOldPassword() {
    this.showOldPassword = !this.showOldPassword;
  }

  toggleNewPassword() {
    this.showNewPassword = !this.showNewPassword;
  }

  update() {
    if (this.newPassword !== this.confirmNewPassword) {
      this.errorMessage = 'New passwords do not match!';
      return;
    }

    this.authService.updateUser(this.user).then(() => {
      // Update user profile
      if (this.oldPassword && this.newPassword) {
        // Change password
        this.authService.changePassword(this.oldPassword, this.newPassword).then(() => {
          alert('Password changed successfully!');
        }).catch(err => {
          this.errorMessage = err.message || 'Error changing password!';
        });
      }
      console.log('Updated user');
      const modalElement = document.getElementById('editProfileModal');
      if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal?.hide();  // Close the modal
      }
    }).catch((err) => {
      this.errorMessage = err.message || 'Error updating user!';
    });
  }

  signOut(event: Event) {
    event.preventDefault();  // Prevent default link behavior
    this.authService.signOut().then(() => {
      alert('Logged Out Successfully!');
      this.isLoggedIn = false;  // Set the isLoggedIn flag to false
      this.user = {} as User;   // Clear the user object after sign out
    }).catch((err) => {
      alert(err);
    });
  }

  signUp() {
    this.router.navigate(['/signUp']);
  }

  login() {
    this.router.navigate(['/login']);
  }
}
