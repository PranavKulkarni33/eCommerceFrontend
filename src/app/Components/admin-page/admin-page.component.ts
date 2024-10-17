import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/Interfaces/user';
import { AdminService } from 'src/app/Services/admin.service';
import { AuthService } from 'src/app/Services/auth.service';
import * as bootstrap from 'bootstrap';


@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {
  user : User = {} as User;
  users: User[] = []; 
  selectedUser: User | null = null;
  selectedProduct: any = null;
  products: any[] = [];
  newProduct: any = {
    id: '',
    name: '',
    price: 0,
    description: '',
    dimensions: '',
    stock: 0,
    delivery_time: '',
    material: '',
    category: '',
    dateCreated: '',
    weight: '',
    images: [] 
  };
  selectedImage: File | null = null;
  addProductModal: any;
  editProductModal: any;
  productDetailsModal: any;
  

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

  // Fetch inventory
  getInventoryHistory(): void {
    this.adminService.getAllProducts().subscribe(
      (products) => {
        this.products = products.Items; // Assuming response contains `Items`
        // Show the "Add New Product" button when products are loaded
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  // Open the "Add New Product" modal
  openAddProductModal(): void {
    const modalElement = document.getElementById('addProductModal');
    if (modalElement) {
      this.addProductModal = new bootstrap.Modal(modalElement);
      this.addProductModal.show();
    }
  }

  // Open the "Edit Product" modal
  openEditProductModal(product: any, event: Event): void {
    event.stopPropagation(); // Prevent triggering row click
    this.selectedProduct = { ...product };
    const modalElement = document.getElementById('editProductModal');
    if (modalElement) {
      this.editProductModal = new bootstrap.Modal(modalElement);
      this.editProductModal.show();
    }
  }

  // Open the product details modal and populate with the selected product
  openProductDetailsModal(product: any): void {
    this.selectedProduct = { ...product }; // Make a copy of the selected product
    const modalElement = document.getElementById('productDetailsModal');
    if (modalElement) {
      this.productDetailsModal = new bootstrap.Modal(modalElement);
      this.productDetailsModal.show();
    }
  }

   // Add a new product
  addProduct(): void {
    if (!this.selectedImage) {
      alert('Please upload a product image.');
      return;
    }

    const formData = new FormData();
    formData.append('product', JSON.stringify(this.newProduct));
    formData.append('image', this.selectedImage);

    this.adminService.addProduct(formData).subscribe(
      () => {
        alert('Product added successfully!');
        this.getInventoryHistory(); // Refresh product list after adding
        this.resetNewProduct();
        this.addProductModal.hide(); // Close the modal
      },
      (error) => {
        console.error('Error adding product:', error);
      }
    );
  }



  // Handle image selection
  onImageSelected(event: any) {
    const file: File = event.target.files[0];
    if (file && file.type === 'image/jpeg') {
      this.selectedImage = file;
    } else {
      alert('Please upload a .jpg image file.');
      this.selectedImage = null;
    }
  }

  // Select a product for editing
  editProduct(product: any): void {
    this.selectedProduct = { ...product };
  }

// Update an existing product
updateProduct(): void {
  if (this.selectedProduct) {
    this.adminService.updateProduct(this.selectedProduct.id, this.selectedProduct).subscribe(
      () => {
        alert('Product updated successfully!');
        this.getInventoryHistory(); // Refresh product list
        this.selectedProduct = null;
        this.editProductModal.hide(); // Close the modal
      },
      (error) => {
        console.error('Error updating product:', error);
      }
    );
  }
}

  // Delete product
  deleteProduct(productId: string, event: Event): void {
    event.stopPropagation(); // Prevent triggering row click
    if (confirm('Are you sure you want to delete this product?')) {
      this.adminService.deleteProduct(productId).subscribe(
        () => {
          alert('Product deleted successfully!');
          this.getInventoryHistory(); // Refresh product list
        },
        (error) => {
          console.error('Error deleting product:', error);
        }
      );
    }
  }

  // Reset new product form
  resetNewProduct(): void {
    this.newProduct = {
      id: '',
      name: '',
      price: 0,
      description: '',
      dimensions: '',
      stock: 0,
      delivery_time: '',
      material: '',
      category: '',
      dateCreated: '',
      weight: '',
      images: []
    };
    this.selectedImage = null;
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
