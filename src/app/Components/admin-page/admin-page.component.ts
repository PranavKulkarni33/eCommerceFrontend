import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/Interfaces/user';
import { AdminService } from 'src/app/Services/admin.service';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {
  user : User = {} as User;
  users: User[] = []; 
  selectedUser: User | null = null;

  constructor(private authService : AuthService, private router : Router, private adminService: AdminService){}
  
  ngOnInit(){
    this.authService.getUser().then((user) => {
      this.user = user.attributes;
    })
  }

  // Fetch all users using AdminService
  getUsers(): void {
    this.adminService.listAllUsers().then(users => {
      this.users = users;
    }).catch(error => {
      console.error('Error fetching users:', error);
    });
  }

  // Select a user for editing
  editUser(user: User): void {
    this.selectedUser = { ...user }; // Create a copy of the selected user for editing
  }

  // Update the selected user's attributes (name and role)
  updateUser(): void {
    if (this.selectedUser) {
      const updatedAttributes = [
        { Name: 'name', Value: this.selectedUser.name },
        { Name: 'custom:role', Value: this.selectedUser.role }
      ];

      this.adminService.updateUserAttributes(this.selectedUser.email, updatedAttributes).then(() => {
        alert('User updated successfully!');
        this.selectedUser = null; 
        this.getUsers(); 
      }).catch(error => {
        console.error('Error updating user:', error);
      });
    }
  }

  deleteUser(user: User): void {
    if (confirm(`Are you sure you want to delete user ${user.email}?`)) {
      this.adminService.deleteUser(user.email).then(() => {
        alert('User deleted successfully!');
        this.getUsers(); 
      }).catch(error => {
        console.error('Error deleting user:', error);
        alert('Failed to delete user.');
      });
    }
  }

  cancelEdit(): void {
    this.selectedUser = null; 
  }

  getSalesHistory(){
    alert('Got Sales History!');
  }

  getInventoryHistory(){
    alert('Got Inventory History');
  }

  openCustomerPage(){
    this.router.navigate(['/customerPage']);
  }


  update(){
    this.authService.updateUser(this.user).then(() => {
      console.log('Updated user');
    }).catch((err) => {
      alert(err);
    })
  }

  signOut(){
    this.authService.signOut().then(() => {
      alert('Logged Out Sucessfully!');
      this.router.navigate(['/customerPage']);
    }).catch((err) => {
      alert(err);
    })
  }
}
