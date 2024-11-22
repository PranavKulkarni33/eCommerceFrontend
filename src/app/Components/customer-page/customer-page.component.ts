import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/Interfaces/user';
import { AuthService } from 'src/app/Services/auth.service';
import * as bootstrap from 'bootstrap';
import { CustomerService } from 'src/app/Services/customer.service';
import { CartService } from 'src/app/Services/cart.service';
import { CartItem } from 'src/app/Interfaces/cart-item';

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
  isLoggedIn = false;
  dropdownOpen = false;
  showOldPassword = false;
  showNewPassword = false;
  errorMessage = '';
  products: any[] = [];
  cartItems: CartItem[] = [];
  cartTotal: number = 0;
  cartModal: any;
  selectedProduct: any = null;
  filteredProducts: any[] = [];
  categories: string[] = ['Paintings', 'Wall Decor', 'Home and Living', 'Holidays', 'Special Occations'];
  selectedCategory: string = ''; 
  selectedPriceRange: string = ''; 
  searchQuery: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private customerService: CustomerService,
    private cartService: CartService
  ) {}

  // Initialize component and load user/cart
  ngOnInit() {
    this.authService.getUser().then((user) => {
      if (user) {
        this.user = user.attributes;
        this.isLoggedIn = true;
        this.syncGuestCartWithUserCart();
      } else {
        this.isLoggedIn = false;
      }
    }).catch(() => {
      this.isLoggedIn = false;
    });

    this.loadProducts();
  }

  // Authentication & User Methods

  // Toggle user dropdown menu
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  // Open Edit Profile modal
  openEditProfileModal(event: Event) {
    event.preventDefault();
    const modalElement = document.getElementById('editProfileModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  // Toggle visibility of old password
  toggleOldPassword() {
    this.showOldPassword = !this.showOldPassword;
  }

  // Toggle visibility of new password
  toggleNewPassword() {
    this.showNewPassword = !this.showNewPassword;
  }

  // Check if user is logged in
  checkUserLogin() {
    this.authService.getUser().then((user) => {
      if (user) {
        this.user = user.attributes;
        this.isLoggedIn = true;
        this.syncGuestCartWithUserCart();
      } else {
        this.isLoggedIn = false;
      }
    }).catch(() => {
      this.isLoggedIn = false;
    });
  }

  // Update user profile and/or password
  update() {
    if (this.newPassword !== this.confirmNewPassword) {
      this.errorMessage = 'New passwords do not match!';
      return;
    }

    this.authService.updateUser(this.user).then(() => {
      if (this.oldPassword && this.newPassword) {
        this.authService.changePassword(this.oldPassword, this.newPassword).then(() => {
          alert('Password changed successfully!');
        }).catch(err => {
          this.errorMessage = err.message || 'Error changing password!';
        });
      }

      const modalElement = document.getElementById('editProfileModal');
      if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal?.hide();
      }
    }).catch((err) => {
      this.errorMessage = err.message || 'Error updating user!';
    });
  }

  // Sign out user and reset cart
  signOut(event: Event) {
    event.preventDefault();
    this.authService.signOut().then(() => {
      alert('Logged Out Successfully!');
      this.isLoggedIn = false;
      this.user = {} as User;
      this.cartItems = [];
      this.cartTotal = 0;
      localStorage.removeItem('guestCart');
    }).catch((err) => {
      alert(err);
    });
  }

  // Navigate to Sign Up page
  signUp() {
    this.router.navigate(['/signUp']);
  }

  // Navigate to Login page
  login() {
    this.router.navigate(['/login']);
  }

  // Product Methods

  // Load all products from the service
  loadProducts() {
    this.customerService.getProducts().subscribe(
      (data) => {
        this.products = data.Items;
        this.filteredProducts = [...this.products]; 
      },
      (err) => {
        console.error('Error fetching products', err);
      }
    );
  }

  // Apply filters based on selected category and price range
  applyFilters() {
    this.filteredProducts = this.products.filter((product) => {
      const categoryMatch = this.selectedCategory ? product.category === this.selectedCategory : true;

      const priceMatch = (() => {
        switch (this.selectedPriceRange) {
          case 'under25':
            return product.price < 25;
          case '26to50':
            return product.price >= 26 && product.price <= 50;
          case '51to100':
            return product.price >= 51 && product.price <= 100;
          case 'over100':
            return product.price > 100;
          default:
            return true;
        }
      })();

      return categoryMatch && priceMatch;
    });
  }

  // Perform search by product name
  performSearch() {
    if (this.searchQuery.trim() === '') {
      // Reset to show all products if search is empty
      this.filteredProducts = [...this.products];
    } else {
      // Filter products based on the search query
      this.filteredProducts = this.products.filter(product =>
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }

  // Open the product details modal
  openProductDetailsModal(product: any) {
    this.selectedProduct = product;
    const modalElement = document.getElementById('productDetailsModal');
    if (modalElement) {
      const productModal = new bootstrap.Modal(modalElement);
      productModal.show();
    }
  }

  // Cart Methods

  // Sync guest cart with user cart after login
  syncGuestCartWithUserCart() {
    let guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');

    if (guestCart.length > 0) {
      this.cartService.getCartByEmail(this.user.email).subscribe(
        (userCart) => {
          const savePromises: Promise<any>[] = [];

          guestCart.forEach((guestItem: CartItem) => {
            const existingItem = userCart.find((item: CartItem) => item.productID === guestItem.productID);
            if (existingItem) {
              existingItem.quantity += guestItem.quantity;
            } else {
              guestItem.userEmail = this.user.email;
              userCart.push(guestItem);
            }
          });

          userCart.forEach((item: CartItem) => {
            const savePromise = this.cartService.addOrUpdateCartItem(item).toPromise();
            savePromises.push(savePromise);
          });

          Promise.all(savePromises).then(() => {
            localStorage.removeItem('guestCart');
            this.loadCart();
          }).catch((err) => {
            console.error('Error syncing guest cart with user cart', err);
          });
        },
        (err) => {
          console.error('Error fetching user cart', err);
        }
      );
    } else {
      this.loadCart();
    }
  }

  // Add product to cart
  addToCart(product: any) {
    const cartItem: CartItem = {
      userEmail: this.isLoggedIn ? this.user.email : 'guest',
      productID: product.id,
      productName: product.name,
      price: product.price,
      quantity: 1
    };

    if (this.isLoggedIn) {
      this.cartService.addOrUpdateCartItem(cartItem).subscribe(
        () => {
          this.loadCart();
        },
        (err) => {
          console.error('Error adding to cart', err);
        }
      );
    } else {
      let guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
      const existingItem = guestCart.find((item: CartItem) => item.productID === product.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        guestCart.push(cartItem);
      }
      localStorage.setItem('guestCart', JSON.stringify(guestCart));
      this.cartItems = guestCart;
      this.updateCartTotal();
    }
  }

  // Load cart for logged-in user or guest
  loadCart() {
    if (this.isLoggedIn) {
      this.cartService.getCartByEmail(this.user.email).subscribe(
        (data) => {
          this.cartItems = data || [];
          this.updateCartTotal();
        },
        (err) => {
          console.error('Error loading cart', err);
        }
      );
    } else {
      let guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
      this.cartItems = guestCart;
      this.updateCartTotal();
    }
  }

  // Update total price of items in the cart
  updateCartTotal() {
    this.cartTotal = this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Update the quantity of a cart item
  updateQuantity(item: CartItem, quantityChange: number) {
    item.quantity += quantityChange;
    if (item.quantity <= 0) {
      this.removeFromCart(item.productID);
    } else if (this.isLoggedIn) {
      this.cartService.addOrUpdateCartItem(item).subscribe(() => {
        this.updateCartTotal();
      });
    } else {
      this.updateCartTotal();
    }
  }

  // Remove an item from the cart
  removeFromCart(productId: string) {
    if (this.isLoggedIn) {
      this.cartService.deleteCartItem(this.user.email, productId).subscribe(() => {
        this.loadCart();
      });
    } else {
      this.cartItems = this.cartItems.filter(item => item.productID !== productId);
      this.updateCartTotal();
    }
  }

  // Open cart modal
  openCartModal() {
    const modalElement = document.getElementById('cartModal');
    if (modalElement) {
      this.cartModal = new bootstrap.Modal(modalElement);
      this.cartModal.show();
    }
  }

  // Proceed to checkout
  goToCheckout() {
    const cartModalElement = document.getElementById('cartModal');
    
    if (cartModalElement) {
      const cartModal = bootstrap.Modal.getInstance(cartModalElement);
  
      if (cartModal) {
        cartModal.hide(); 
      }
    }
    this.router.navigate(['/checkoutPage']);
  }
  
  
}
