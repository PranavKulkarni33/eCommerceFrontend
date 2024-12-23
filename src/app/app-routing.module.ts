import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { SignupComponent } from './Components/signup/signup.component';
import { CustomerPageComponent } from './Components/customer-page/customer-page.component';
import { AdminPageComponent } from './Components/admin-page/admin-page.component';
import { ConfirmSignUpComponent } from './Components/confirm-sign-up/confirm-sign-up.component';
import { AuthGuard } from './Services/auth-guard.service';
import { CheckoutPageComponent } from './Components/checkout-page/checkout-page.component';
import { SuccessPageComponent } from './Components/success-page/success-page.component';
import { CancelPageComponent } from './Components/cancel-page/cancel-page.component';

const routes: Routes = [
  { path: '', redirectTo: '/customerPage', pathMatch: 'full' }, 
  { path: 'login', component: LoginComponent },
  { path: 'signUp', component: SignupComponent },
  { path: 'confirmSignUp', component: ConfirmSignUpComponent },
  { path: 'customerPage', component: CustomerPageComponent },
  { path: 'checkoutPage', component: CheckoutPageComponent },
  { path: 'success', component: SuccessPageComponent },
  { path: 'cancel', component: CancelPageComponent },
  { path: 'adminPage', component: AdminPageComponent, canActivate : [AuthGuard]  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
