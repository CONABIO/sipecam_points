import { Injectable } from '@angular/core';
import { JwtPayload } from 'jwt-decode';

export interface Cumulus {
  id: number;
  name: string;
}

export interface CustomJwtPayload extends JwtPayload {
  id: number;
  cumulus: Cumulus[];
  roles: string[];
}

export interface Credentials {
  // Customize received credentials here
  username: string;
  token: string;
  decoded: CustomJwtPayload;
}

const credentialsKey = 'credentials';

/**
 * Provides storage for authentication credentials.
 * The Credentials interface should be replaced with proper implementation.
 */
@Injectable({
  providedIn: 'root',
})
export class CredentialsService {
  private _credentials: Credentials | null = null;

  constructor() {
    const savedCredentials = sessionStorage.getItem(credentialsKey) || localStorage.getItem(credentialsKey);
    if (savedCredentials) {
      this._credentials = JSON.parse(savedCredentials);
    }
  }

  /**
   * Checks is the user has the admin role.
   * @return True if the user has an admin role.
   */
  isAdmin(): boolean {
    return !!this.credentials?.decoded?.roles?.find((role) => role === 'admin');
  }

  /**
   * Checks is the user is authenticated.
   * @return True if the user is authenticated.
   */
  isAuthenticated(): boolean {
    return !!this.credentials;
  }

  /**
   * Checks is the user has the partner role.
   * @return True if the user has a partner role.
   */
  isPartner(): boolean {
    return !!this.credentials?.decoded?.roles?.find((role) => role === 'partner');
  }

  /**
   * Gets the user credentials.
   * @return The user credentials or null if the user is not authenticated.
   */
  get credentials(): Credentials | null {
    return this._credentials;
  }

  /**
   * Gets the user associated cumulus.
   * @return The cumulus that are associated with the user.
   */
  get cumulus(): number[] {
    return this.credentials?.decoded?.cumulus?.map((c) => c.id) ?? [];
  }

  /**
   * Gets the user token.
   * @return The user token or null if the user is not authenticated.
   */
  /*get token(): string | null {
    return this.isAuthenticated() ? this._credentials.id : null;
  }*/

  /**
   * Sets the user credentials.
   * The credentials may be persisted across sessions by setting the `remember` parameter to true.
   * Otherwise, the credentials are only persisted for the current session.
   * @param credentials The user credentials.
   * @param remember True to remember credentials across sessions.
   */
  setCredentials(credentials?: Credentials, remember?: boolean) {
    this._credentials = credentials || null;

    if (credentials) {
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(credentialsKey, JSON.stringify(credentials));
    } else {
      sessionStorage.removeItem(credentialsKey);
      localStorage.removeItem(credentialsKey);
    }
  }
}
