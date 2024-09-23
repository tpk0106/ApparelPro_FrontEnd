import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(private toastrService:ToastrService) {
   }

   handleError(error:any):void{
    console.log(error);
    
    this.toastrService.error(error.error);
    throwError(() =>{      
      error;
    });
   }
}
