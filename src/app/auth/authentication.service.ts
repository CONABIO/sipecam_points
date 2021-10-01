import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import jwtDecode from 'jwt-decode';

import { Credentials, CredentialsService, CustomJwtPayload } from './credentials.service';
import { environment } from '@env/environment';

export interface LoginContext {
  username: string;
  password: string;
  remember?: boolean;
}

export interface LoginResponse {
  token: string;
}

/**
 * Provides a base for authentication workflow.
 * The login/logout methods should be replaced with proper implementation.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private credentialsService: CredentialsService, private http: HttpClient) {}

  /**
   * Authenticates the user.
   * @param context The login parameters.
   * @return The user credentials.
   */
  login(context: LoginContext): Observable<Credentials> {
    let credentials: Credentials = null;

    return from(
      this.http
        .post<LoginResponse>(`${environment.serverUrl}/login`, {
          username: context.username,
          password: context.password,
        })
        .toPromise()
        .then((data) => {
          const decoded = jwtDecode<CustomJwtPayload>(data.token);
          credentials = {
            username: context.username,
            token: data.token,
            decoded,
          };
          this.credentialsService.setCredentials(credentials, context.remember);
          return credentials;
        })
    );
  }

  /**
   * Logs out the user and clear credentials.
   * @return True if the user was logged out successfully.
   */
  logout(): Observable<boolean> {
    this.credentialsService.setCredentials();
    return of(true);
  }
}
