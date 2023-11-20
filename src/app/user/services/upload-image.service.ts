import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, map, tap, throwError } from 'rxjs';
import { UploadWeb3 } from '../interfaces/w3-response.interface';
import { environment } from 'src/environments/environment';
// import { Web3Storage } from 'web3.storage'

@Injectable({
  providedIn: 'root'
})
export class UploadImageService {

  private http = inject(HttpClient);

  public uploadImage(image: File) {
    console.log('#UploadImageService - uploadImage');
    const url = 'https://api.web3.storage/upload';
    const formData = new FormData();

    formData.append('file', image);
    // console.log('#uploadImage');
    // console.log(image);

    const headers = this.getHttpHeaders(environment.w3StorageToken);
    return this.http.post<UploadWeb3>(url, formData, headers)
      .pipe(
        map( data => {
          console.log(data);
          return `https://${data.cid}.ipfs.w3s.link`;
          //return `https://ipfs.io/${data.cid}`;
        }),
        catchError( err => throwError( () => err.error.message))
      )
  }
//--------------------------------------------------------------------
private getHttpHeaders(token: string|null){
  const headers: HttpHeaders = new HttpHeaders()
    .set('Authorization', 'Bearer '+token);

  return  {
    headers: headers
  };
}

}
