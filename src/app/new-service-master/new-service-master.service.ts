import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ServiceMaster } from './new-service-master.model';
import { ApiService } from '../shared/ApiService.service';

@Injectable()
export class ServiceMasterService {
  recordsChanged = new Subject<ServiceMaster[]>();
  startedEditing = new Subject<number>();
  constructor(private apiService: ApiService) { }
  private recordsApi!: ServiceMaster[]

  getRecords() {
    this.apiService.get<ServiceMaster[]>('servicenumbers').subscribe(response => {
      console.log(response);
      this.recordsApi = response;
      this.recordsChanged.next(this.recordsApi);
    });
  }

  getRecord(id: number): Observable<ServiceMaster> {
      return this.apiService.getID<ServiceMaster>('servicenumbers', id);
  }


  addRecord(record: ServiceMaster) {
    this.apiService.post<ServiceMaster>('servicenumbers', record).subscribe((response: ServiceMaster) => {
      console.log('service master created:', response);
      this.getRecords();
      return response
    });
  }

  updateRecord(index: number, newRecord: ServiceMaster) {
    this.apiService.put<ServiceMaster>('servicenumbers', index, newRecord).subscribe(response => {
      console.log('service master updated:',response);
      this.getRecords()
    });
  }
}