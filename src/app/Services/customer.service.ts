import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private baseUrl = 'http://localhost:3000/products'; // Replace with your backend URL

  constructor(private http: HttpClient) { }

  // Method to get all products
  getProducts(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  // Method to get a single product by ID
  getProductById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }
}
