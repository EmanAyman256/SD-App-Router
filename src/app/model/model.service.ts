import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ModelEntity } from './model.model';
import { ApiService } from '../shared/ApiService.service';

@Injectable()
export class ModelService {
  recordsChanged = new Subject<ModelEntity[]>();
  startedEditing = new Subject<number>();
  constructor(private apiService: ApiService) { }
  private recordsApi!: ModelEntity[]

  getRecords() {
    this.apiService.get<ModelEntity[]>('modelspecs').subscribe(response => {
      console.log(response);
      this.recordsApi = response;
      this.recordsChanged.next(this.recordsApi);
    });
  }

  addRecord(record: ModelEntity) {
    this.apiService.post<ModelEntity>('modelspecs', record).subscribe((response: ModelEntity) => {
      console.log('modelspecs created:', response);
      this.getRecords();
      return response
    });
  }

  updateRecord(index: number, newRecord: ModelEntity) {
    this.apiService.put<ModelEntity>('modelspecs', index, newRecord).subscribe(response => {
      console.log('modelspecs updated:',response);
      this.getRecords()
    });
  }

  deleteRecord(index: number) {

  }

}