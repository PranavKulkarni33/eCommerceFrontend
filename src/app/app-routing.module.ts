import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { SignupComponent } from './Components/signup/signup.component';
import { CustomerPageComponent } from './Components/customer-page/customer-page.component';
import { AdminPageComponent } from './Components/admin-page/admin-page.component';
import { ConfirmSignUpComponent } from './Components/confirm-sign-up/confirm-sign-up.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, 
  { path: 'login', component: LoginComponent },
  { path: 'signUp', component: SignupComponent },
  { path: 'confirmSignUp', component: ConfirmSignUpComponent },
  { path: 'customerPage', component: CustomerPageComponent },
  { path: 'adminPage', component: AdminPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
