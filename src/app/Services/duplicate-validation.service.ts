import { Injectable } from '@angular/core';
import { DuplicateValidationInjectorService } from './InjectorService';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DuplicateValidationService {
  // override isDuplicate(entry: T, code: string): Observable<boolean> {
  //   throw new Error('Method not implemented.');
  // }

  constructor() {}
}
