import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {environment} from "../../../environments/environment.development";
import {PopupType} from "../../../types/popup.type";

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private http: HttpClient) { }

  getModalOrder(data: PopupType): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'requests', data)
  }
}
