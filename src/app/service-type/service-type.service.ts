import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import { ServiceType } from './service-type.model';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../shared/ApiService.service';

@Injectable()
export class ServiceTypeService {
  recordsChanged = new Subject<ServiceType[]>();
  startedEditing = new Subject<number>();
  model!:'servicetypes';
  constructor(private apiService:ApiService ,private http: HttpClient) { }
  private recordsApi!: ServiceType[]

  getApiRecords(){
    this.apiService.get<ServiceType[]>('servicetypes').subscribe(response => {
      console.log(response);
      this.recordsApi = response;
      this.recordsChanged.next(this.recordsApi); 
    });
  }
  addApiRecord(record: ServiceType) {
    this.apiService.post<ServiceType>('servicetypes', record).subscribe((response: ServiceType) => {
      console.log('ServiceType created:', response);
      this.getApiRecords();
    });
    return this.apiService.post<ServiceType>('servicetypes', record);
  }
  updateApiRecord(id:number,record: any) {
    console.log(this.apiService.put<ServiceType>('servicetypes',id, record));
   this.apiService.put<ServiceType>('servicetypes',id,record).subscribe(response => {
    console.log(response);
   this.getApiRecords()
  });
  }
  getApiRecord(index:number) {
   return this.apiService.getID<ServiceType>('servicetypes',index)
  }
  deleteApiRecord(id:number) {
    console.log(this.apiService.delete<ServiceType>('servicetypes',id));
    this.apiService.delete<ServiceType>('servicetypes',id).subscribe(response =>{
      console.log(response);
      this.getApiRecords();
    })
    
  }
  updateRecord(index: number, newRecord: ServiceType) {
    this.apiService.put<ServiceType>('servicetypes', index, newRecord).subscribe(response => {
      console.log('modelspecs updated:',response);
      this.getApiRecords()
    });
  }
}