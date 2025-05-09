import { Injectable } from "@angular/core";
import { environment } from "@env";
import { HttpService } from "./http.service";
import { Observable } from "rxjs/internal/Observable";
import { Event } from "@core/models/event.model";
import { tap } from "rxjs";
import { AccessType } from "@core/models/access-type.model";

@Injectable({
    providedIn: 'root',
  })
  export class AccessTypeService {
    static readonly END_POINT = environment.REST + '/access-types';
  
    constructor(private readonly httpService: HttpService) {}

    createAccessType(accessType: AccessType): Observable<AccessType> {
        return this.httpService.post(AccessTypeService.END_POINT, accessType);
      }

      deleteAccessType(reference: string): Observable<AccessType> {
        return this.httpService.delete(AccessTypeService.END_POINT + '/' + reference);
      }

      updateAccessType(reference: string, accessType: AccessType): Observable<AccessType> {
        return this.httpService.put(AccessTypeService.END_POINT + '/' + reference, accessType);
      }
    

      
  }