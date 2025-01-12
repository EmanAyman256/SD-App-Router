import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { ModelSpecDetails } from './model-details.model';
import { ApiService } from '../shared/ApiService.service';

@Injectable()
export class ModelSpecDetailService {
  recordsChanged = new Subject<ModelSpecDetails[]>();
  startedEditing = new Subject<number>();
  constructor(private apiService: ApiService) { }
  private recordsApi!: ModelSpecDetails[]

  getRecords() {
    this.apiService.get<ModelSpecDetails[]>('modelspecdetails').subscribe(response => {
      console.log(response);
      this.recordsApi = response;
      this.recordsChanged.next(this.recordsApi);
    });
  }

  getRecord(index: number): Observable<ModelSpecDetails> {
    return this.apiService.getID<ModelSpecDetails>('modelspecdetails', index);
  }
 
  addRecord(record: ModelSpecDetails) {
    this.apiService.post<ModelSpecDetails>('modelspecdetails', record).subscribe((response: ModelSpecDetails) => {
      console.log('modelspecDetail created:', response);
      this.getRecords();
      return response
    });
  }

  updateRecord(index: number, newRecord: ModelSpecDetails) {
    this.apiService.put<ModelSpecDetails>('modelspecdetails', index, newRecord).subscribe(response => {
      console.log('modelspecDetail updated:',response);
      this.getRecords()
    });
  }

  deleteRecord(index: any) {
    this.apiService.delete<ModelSpecDetails>('modelspecdetails', index).subscribe(response => {
      console.log('model spec deleted:',response);
      this.getRecords()
    });
  }
}