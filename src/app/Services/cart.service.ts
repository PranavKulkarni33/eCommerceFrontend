import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private baseUrl = 'http://localhost:3000/cart'; 

  constructor(private http: HttpClient) { }

  // Add or update a cart item
  addOrUpdateCartItem(cartItem: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, cartItem);
  }

  // Get cart items by user email
  getCartByEmail(email: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${email}`);
  }

  // Delete a cart item
  deleteCartItem(email: string, productId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${email}/${productId}`);
  }
}
