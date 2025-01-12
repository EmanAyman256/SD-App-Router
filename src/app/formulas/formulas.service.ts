import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Formula } from './formulas.model';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../shared/ApiService.service';

@Injectable()
export class FormulasService {
  recordsChanged = new Subject<Formula[]>();
  startedEditing = new Subject<number>();
  model!:'formulas';
  constructor(private apiService:ApiService ,private http: HttpClient) { }
  private recordsApi!: Formula[]

  getApiRecords(){
    this.apiService.get<Formula[]>('formulas').subscribe(response => {
      console.log(response);
      this.recordsApi = response;
      this.recordsChanged.next(this.recordsApi); 
    });
  }
}