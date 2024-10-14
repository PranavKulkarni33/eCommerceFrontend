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
      password : user.password
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
}
