import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/Services/cart.service';
import { CartItem } from 'src/app/Interfaces/cart-item';
import { AuthService } from 'src/app/Services/auth.service';
import * as bootstrap from 'bootstrap';
import { CheckoutService } from 'src/app/Services/checkout.service';

@Component({
  selector: 'app-checkout-page',
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.css']
})
export class CheckoutPageComponent implements OnInit {
  
  user: any = {}; 
  isLoggedIn = false; 
  cartItems: CartItem[] = [];
  subtotal: number = 0;
  gst: number = 0; 
  deliveryFee: number = 10; 
  totalPrice: number = 0; 
  shippingDetails: any = { 
    name: '',
    address: '',
    city: '',
    zip: '',
    phone: ''
  };

  dropdownOpen: boolean = false; 

  constructor(
    private authService: AuthService,
    private router: Router,
    private cartService: CartService,
    private checkoutService: CheckoutService,
  ) {}

  ngOnInit(): void {
    this.authService.getUser().then((user) => {
      if (user) {
        this.user = user.attributes;
        this.isLoggedIn = true;
        this.loadCart(); // Load cart details if user is logged in
        this.initializeBootstrapComponents(); // Reinitialize Bootstrap components
      } else {
        this.isLoggedIn = false;
        this.router.navigate(['/login']); // Redirect to login page if not logged in
      }
    }).catch(() => {
      this.isLoggedIn = false;
      this.router.navigate(['/login']); // Redirect to login page in case of an error
    });
}
  initializeBootstrapComponents(): void {
  // Reinitialize Bootstrap dropdown and other components
  const dropdownElements = document.querySelectorAll('.dropdown-toggle');
  dropdownElements.forEach(dropdown => {
    new bootstrap.Dropdown(dropdown);
  });

}

  // Load the cart items for the logged-in user
  loadCart() {
    this.cartService.getCartByEmail(this.user.email).subscribe(
      (data) => {
        this.cartItems = data || [];
        this.calculateTotals(); // Calculate totals when cart items are loaded
      },
      (err) => {
        console.error('Error loading cart', err);
      }
    );
  }

  // Calculate subtotal, GST, and total price
  calculateTotals() {
    this.subtotal = this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    this.gst = this.subtotal * 0.13; // GST is 13% of the subtotal
    this.totalPrice = this.subtotal + this.gst ;
  }

 // Handle shipping form submission and initiate payment
  submitShippingDetails() {
    if (this.isLoggedIn && this.cartItems.length > 0) {
      const orderDetails = {
        cartItems: this.cartItems,
        shippingDetails: this.shippingDetails,
        totalPrice: this.totalPrice,
        customerEmail: this.user.email  // Add the logged-in user's email
      };

      // Create Stripe checkout session
      this.checkoutService.createCheckoutSession(orderDetails).subscribe(
        (response) => {
          window.location.href = response.url; // Redirect to Stripe Checkout
        },
        (err) => {
          console.error('Error creating Stripe session', err);
        }
      );
    } else {
      alert('Your cart is empty or you are not logged in.');
    }
  }


  // Toggle the user dropdown in the navbar
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  // Open the cart modal
  openCartModal() {
    const modalElement = document.getElementById('cartModal');
    if (modalElement) {
      const cartModal = new bootstrap.Modal(modalElement);
      cartModal.show();
    }
  }

  // Open the edit profile modal
  openEditProfileModal(event: Event) {
    event.preventDefault();
    const modalElement = document.getElementById('editProfileModal');
    if (modalElement) {
      const editProfileModal = new bootstrap.Modal(modalElement);
      editProfileModal.show();
    }
  }

  // Sign out the user
  signOut(event: Event) {
    event.preventDefault();
    this.authService.signOut().then(() => {
      alert('Logged Out Successfully!');
      this.isLoggedIn = false;
      this.user = {}; // Clear user details
      this.cartItems = []; // Clear cart items
      this.subtotal = 0; // Reset subtotal
      this.gst = 0; // Reset GST
      this.totalPrice = 0; // Reset total price
      localStorage.removeItem('guestCart'); // Remove guest cart if stored
      this.router.navigate(['/login']); // Redirect to login page
    }).catch((err) => {
      alert(err); // Show error if sign-out fails
    });
  }

  // Navigate to the login page
  login() {
    this.router.navigate(['/login']);
  }

  // Navigate to the sign-up page
  signUp() {
    this.router.navigate(['/signUp']);
  }

  // Navigate to customer Page
  back(){
    this.router.navigate(['/customerPage']);
  }
}
