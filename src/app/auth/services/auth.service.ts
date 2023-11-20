import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';

import { User } from '../interfaces/user.interface';
import { AuthStatus } from '../interfaces/auth-status.enum';
import { LoginResponse } from '../interfaces/login-response.interface';
import { CheckTokenResponse } from '../interfaces/check-token.response.interface';
import { environment } from 'src/environments/environment';
import { AuthRol } from '../interfaces/auth-rol.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl: string = environment.backEndUri;
  private readonly userFrontToken: string = environment.userFrontToken;
  private http = inject(HttpClient);

  private _currentUser = signal<User|null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);

  public currentUser = computed(() => this._currentUser());
  public authStatus = computed(() => this._authStatus());


  /* Login */
  public login(email: string, password: string):Observable<boolean>{
    const url = this.baseUrl+'/auth/login'
    const body = {
      email: email,
      password: password,
    };

    const headers = this.getHttpHeaders(this.userFrontToken);

    return this.http.post<LoginResponse>(url, body, headers)
      .pipe(
        map(({token, user}) => this.setAuthentication(user, token)),
        catchError( err => {
          return throwError( () => err.error);
        })
      )
  }

  /* Register */
  public register(name: string, email: string, password: string):Observable<boolean>{
    const url = this.baseUrl+'/auth/register'
    const body = {
      name: name,
      email: email,
      password: password,
    };

    const headers = this.getHttpHeaders(this.userFrontToken);

    return this.http.post<LoginResponse>(url, body, headers)
      .pipe(
        map(({token, user}) => this.setAuthentication(user, token)),
        catchError( err => throwError( () => err.error.message))
      )
  }

  /* Validate Register*/
  public validateRegister(email: string, token: string):Observable<boolean>{
    const url = this.baseUrl+'/auth/validate'
    const body = {
      email: email,
    };

    const headers = this.getHttpHeaders(token);

    return this.http.post<User>(url, body, headers)
      .pipe(
        map(user => this.setAuthentication(user, token)),
        catchError( err => {
          return throwError( () => err.error.message);
        })
      )
  }

  /* Send Token (restore password) */
  public sendToken(email: string):Observable<boolean>{
    const url = this.baseUrl+'/auth/send-token'
    const body = {
      email: email,
    };

    const headers = this.getHttpHeaders(this.userFrontToken);

    return this.http.post<any>(url, body, headers)
      .pipe(
        map(response => response.done),
        catchError( err => throwError( () => err.error.message))
      )
  }

  /* Restore Password */
  public restorePassword(email: string, password: string, token: string):Observable<boolean>{
    const url = this.baseUrl+'/auth/restore-password'
    const body = {
      email: email,
      password: password
    };

    const headers = this.getHttpHeaders(token);

    return this.http.post<User>(url, body, headers)
      .pipe(
        map(user => this.setAuthentication(user, token)),
        catchError( err => throwError( () => err.error.message))
      )
  }

  /* Check Status */
  public checkAuthStatus(): Observable<boolean>{
    console.log('#checkAuthStatus');
    const url = this.baseUrl+'/auth/check-token';
    const token = localStorage.getItem('token');

    if( !token ){
      this.logout();
      return of(false);
    }
    const headers = this.getHttpHeaders(token);

    return this.http.get<CheckTokenResponse>(url, headers)
      .pipe(
        map(({token, user}) => this.setAuthentication(user, token)),
        catchError( () => {
          this._authStatus.set(AuthStatus.notAuthenticated);
          return of(false);
        })
      );
  }


  /* Find emails */
  public findUsersByMail(email: string): Observable<User[]>{
    console.log('#findUsersByMail');
    const url = this.baseUrl+'/auth/find-mails';
    const token = localStorage.getItem('token');

    if( !token ){
      this.logout();
      return of([]);
    }

    const params = {
      email: email,
    };
    const options = this.getOptions(token, params);

    return this.http.get<User[]>(url, options)
      .pipe(
        catchError( err => {
          return of([]);
        })
      );
  }


  /* Swap token */
  public swapTokenById(id: string|undefined){
    console.log('#swapTokenById');

    if(id && this.currentUser()?.roles.includes(AuthRol.admin)){
      this.tokenById(id)
        .subscribe(token => {
          localStorage.setItem('token', token);
        });
    }
  }

  /* Logout */
  public logout(){
    this._currentUser.set(null);
    this._authStatus.set(AuthStatus.notAuthenticated);
    localStorage.removeItem('token');
  }

//--------------------------------------------------------------------
  private tokenById(id: string): Observable<string>{
    console.log('#tokenById');

    const url = this.baseUrl+'/auth/token-by-id/'+id;
    const token = localStorage.getItem('token');

    if( !token ){
      this.logout();
      return of('');
    }

    const options = this.getHttpHeaders(token);

    return this.http.get<any>(url, options)
      .pipe(
        map(({token}) => token),
        catchError( (err) => {
          return of('');
        })
      );
  }
//--------------------------------------------------------------------
  private addNewRoles(aCurrent: string[], aAppend: string[]):  string[]{
    for(let append of aAppend){
      if ( aCurrent.includes(append) ){
        aCurrent.push(append);
      }
    }
    return aCurrent;
  }
//--------------------------------------------------------------------
  private setAuthentication(user: User, token: string): boolean{
    this._currentUser.set(user);
    this._authStatus.set(AuthStatus.authenticated);
    localStorage.setItem('token', token);
    return true;
  }
//--------------------------------------------------------------------
  private getOptions(token: string, params: any){
    const headers:HttpHeaders = new HttpHeaders()
      .set('Authorization', 'Bearer '+token);

    return  {
      headers: headers,
      params: params
    };
  }
//--------------------------------------------------------------------
  private getHttpHeaders(token: string){
    const headers:HttpHeaders = new HttpHeaders()
      .set('Authorization', 'Bearer '+token);

    return  {
      headers: headers
    };
  }
}
