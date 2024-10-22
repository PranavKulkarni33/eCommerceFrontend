import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private baseUrl = 'http://localhost:3000'; // Base URL for your backend API

  constructor(private http: HttpClient) { }

  // Create Stripe Checkout session for the order
  createCheckoutSession(orderDetails: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create-checkout-session`, orderDetails);
  }

  // (Optional) Retrieve Stripe session details by session ID
  getCheckoutSession(sessionId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/checkout-session/${sessionId}`);
  }

  // Record the sale details after successful payment
  recordSale(saleDetails: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/record-sale`, saleDetails);
  }

  getSalesHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/sales`);  // Assuming your backend has a /sales route
  }
}
