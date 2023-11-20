import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DocumentCvResponse, MetadataCvResponse } from '../interfaces/cv-response.interfaces';

@Injectable({
  providedIn: 'root'
})
export class CvService {

  constructor() { }

  private readonly baseUrl: string = environment.backEndUri;
  private readonly userFrontToken: string = environment.userFrontToken;
  private http = inject(HttpClient);

  //------------------------------------------------------------------
  public create(document: string, version: string): Observable<boolean>{
    console.log('└─ #create - version: '+version);
    const url = this.baseUrl+'/cv/create'
    const token = localStorage.getItem('token');
    const headers = this.getHttpHeaders(token);

    const body = {
      document: document,
      version: version,
    };

    return this.http.post<MetadataCvResponse>(url, body, headers)
      .pipe(
        map(res =>  res ? true : false),
        catchError( err => throwError( () => err.error.message))
      )
  }

  public getCvVersions(): Observable<MetadataCvResponse[]>{
    console.log('└─ #getCvVersions');
    const url = this.baseUrl+'/cv/find-by-user'
    const token = localStorage.getItem('token');
    const headers = this.getHttpHeaders(token);

    return this.http.get<MetadataCvResponse[]>(url, headers)
      .pipe(
        // tap( data => { console.log(data)}),
        catchError( err => throwError( () => err.error.message))
      )
  }

  public getCvById(id: string): Observable<DocumentCvResponse>{
    console.log('└─ #getCvById - id: '+id);
    const url = this.baseUrl+'/cv/id/'+id;
    const token = localStorage.getItem('token');
    const headers = this.getHttpHeaders(token);

    return this.http.get<any>(url, headers)
      .pipe(
        catchError( err => throwError( () => err.error.message))
      )
  }

  public updateCv(document: string, id: string): Observable<boolean>{
    console.log('└─ #updateCv - id: '+id);
    const url = this.baseUrl+'/cv/update/'+id;
    const token = localStorage.getItem('token');
    const headers = this.getHttpHeaders(token);

    const body = {
      document: document,
    };

    return this.http.patch<any>(url, body, headers)
      .pipe(
        tap( data => data ? true : false),
        catchError( err => throwError( () => err.error.message))
      )
  }

  public deleteCv(id: string): Observable<boolean>{
    console.log('└─ #deleteCv - id: '+id);
    const url = this.baseUrl+'/cv/delete/'+id;
    const token = localStorage.getItem('token');
    const headers = this.getHttpHeaders(token);

    return this.http.delete<any>(url, headers)
      .pipe(
        catchError( err => {
          console.log(err);
          return throwError( () => err.error.message);
        })
      )
  }
//--------------------------------------------------------------------
  private getHttpHeaders(token: string|null){
    const headers: HttpHeaders = new HttpHeaders()
      .set('Authorization', 'Bearer '+token);
      //.set('test-01', 'test-01');

    return  {
      headers: headers
    };
  }

}
