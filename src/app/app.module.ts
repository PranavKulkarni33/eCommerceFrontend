import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Components/login/login.component';
import { SignupComponent } from './Components/signup/signup.component';
import { CustomerPageComponent } from './Components/customer-page/customer-page.component';
import { AdminPageComponent } from './Components/admin-page/admin-page.component';
import { FormsModule } from '@angular/forms';
import { ConfirmSignUpComponent } from './Components/confirm-sign-up/confirm-sign-up.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    CustomerPageComponent,
    AdminPageComponent,
    ConfirmSignUpComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
