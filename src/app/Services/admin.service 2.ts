import { Injectable } from '@angular/core';
import { Amplify, Auth } from 'aws-amplify';
import { environment } from 'src/environments/environment';
import * as AWS from 'aws-sdk';
import { User } from '../Interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  cognitoIdentityServiceProvider!: AWS.CognitoIdentityServiceProvider;

  constructor() {
    Amplify.configure({
      Auth: {
        identityPoolId: environment.cognito.identityPoolId,
        region: environment.cognito.region,
        userPoolId: environment.cognito.userPoolId,
        userPoolWebClientId: environment.cognito.userPoolWebClientId
      }
    });

    this.configureCognito();
  }

  async configureCognito() {
    try {
      // Get AWS credentials from the Identity Pool
      const credentials = await Auth.currentCredentials();

      // Set AWS config with the credentials obtained from the identity pool
      AWS.config.update({
        region: environment.cognito.region,
        credentials: Auth.essentialCredentials(credentials) // Extracts credentials for AWS SDK
      });

      // Initialize CognitoIdentityServiceProvider with proper credentials
      this.cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();
    } catch (error) {
      console.error('Error fetching AWS credentials: ', error);
    }
  }

  // List all users from Cognito User Pool
  listAllUsers(): Promise<User[]> {
    const params = {
      UserPoolId: environment.cognito.userPoolId,
      Limit: 60
    };

    return new Promise((resolve, reject) => {
      if (!this.cognitoIdentityServiceProvider) {
        reject('CognitoIdentityServiceProvider is not initialized');
        return;
      }

      this.cognitoIdentityServiceProvider.listUsers(params, (err, data) => {
        if (err) {
          reject(err);
        } else if (data?.Users) {
          const users: User[] = data.Users.map((u) => {
            const emailAttr = u.Attributes?.find(attr => attr.Name === 'email')?.Value || '';
            const nameAttr = u.Attributes?.find(attr => attr.Name === 'name')?.Value || '';
            const roleAttr = u.Attributes?.find(attr => attr.Name === 'custom:role')?.Value || 'Customer';

            return {
              email: emailAttr,
              name: nameAttr,
              role: roleAttr,
              password: '', 
              showPassword: false,
              code: '' 
            };
          });
          resolve(users);
        } else {
          resolve([]);
        }
      });
    });
  }

  // Delete user from Cognito User Pool
  deleteUser(email: string): Promise<void> {
    const params = {
      UserPoolId: environment.cognito.userPoolId,
      Username: email
    };

    return new Promise((resolve, reject) => {
      this.cognitoIdentityServiceProvider.adminDeleteUser(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  // Update user attributes (name and role)
  updateUserAttributes(username: string, attributes: { Name: string, Value: string }[]): Promise<void> {
    const params = {
      UserPoolId: environment.cognito.userPoolId,
      Username: username,
      UserAttributes: attributes
    };

    return new Promise((resolve, reject) => {
      if (!this.cognitoIdentityServiceProvider) {
        reject('CognitoIdentityServiceProvider is not initialized');
        return;
      }

      this.cognitoIdentityServiceProvider.adminUpdateUserAttributes(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}
