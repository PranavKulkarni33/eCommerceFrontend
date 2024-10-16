import { Injectable } from '@angular/core';
import { Amplify, Auth } from 'aws-amplify';
import { environment } from 'src/environments/environment';
import { User } from '../Interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {
    Amplify.configure({
      Auth: environment.cognito
    })
   }

  signUp(user : User ): Promise<any>{
    return Auth.signUp({
      username :user.email,
      password : user.password,
      attributes : {
        name: user.name,
        'custom:role' : 'Customer'
      }
    })
   }

  confirmSignUp(user: User): Promise <any>{
    return Auth.confirmSignUp(user.email, user.code)
   }

  resendSignUp(user: User): Promise <any> {
    return Auth.resendSignUp(user.email);
  }

  login(user: User): Promise <any>{
    return Auth.signIn(user.email, user.password)
   }

   getUser() : Promise <any>{
    return Auth.currentUserInfo();
   }

   updateUser(user : User): Promise<any>{
    return Auth.currentUserPoolUser().then((cognitoUser => {
      return Auth.updateUserAttributes(cognitoUser,user);
    }))
   }

   signOut() : Promise<any> {
    return Auth.signOut();
   }

   forgotPassword(email: string): Promise<any> {
    return Auth.forgotPassword(email);
  }
  
  confirmResetPassword(email: string, code: string, newPassword: string): Promise<any> {
    return Auth.forgotPasswordSubmit(email, code, newPassword);
  }
  
    

  changePassword(oldPassword: string, newPassword: string): Promise<any> {
      return Auth.currentAuthenticatedUser().then(user => {
        return Auth.changePassword(user, oldPassword, newPassword);
      });
    }
    
  

   getRole() : Promise<any> {
    return this.getUser().then((user)  => {
      return user && user.attributes ? user.attributes['custom:role'] : '';
    })
   }

}
