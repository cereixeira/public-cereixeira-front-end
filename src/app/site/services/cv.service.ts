import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';


import { environment } from 'src/environments/environment';
import { SiteCv } from '../interfaces/site-cv.interface';

@Injectable({
  providedIn: 'root'
})
export class CvService {


}
