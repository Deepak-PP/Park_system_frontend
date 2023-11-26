import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root',
})
export class ParklotService {
  constructor(private http: HttpClient) {}

  baseUrl = 'http://localhost:5000';

  getdefaultMembers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/defaultMembersList`);
  }

  getParkSlots(): Observable<any> {
    return this.http.get(`${this.baseUrl}/parkSlotsData`);
  }

  temporaryLeaveAdd(formData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/temporaryLeave`, formData);
  }

  temporaryPersonAdd(formData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/temporaryPerson`, formData);
  }

  notifySwal(message:any, title:any) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: title,
      title: message,
    });
  }
}
