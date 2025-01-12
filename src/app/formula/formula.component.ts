import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ApiService } from '../shared/ApiService.service';


@Component({
  selector: 'app-formula',
  templateUrl: './formula.component.html',
  styleUrls: ['./formula.component.css'],
  providers: [MessageService]
})
export class FormulaComponent implements OnInit {

  isFormValid = false;
  items!: MenuItem[];
  subscription!: Subscription;

  constructor(public messageService: MessageService,private apiService: ApiService) {}

  ngOnInit() {
      this.items = [
          {
              label: 'Create',
              routerLink: 'create'
          },
          {
              label: 'Set Parameters',
              routerLink: 'parameter'
          },
          {
              label: 'Relation',
              routerLink: 'relation'
          },
          {
              label: 'Test',
              routerLink: 'test'
          }
      ];
  }

  ngOnDestroy() {
      if (this.subscription) {
          this.subscription.unsubscribe();
      }
  }
  
  getApiRecords() {
    this.apiService.get<any>('formulas').subscribe(response => {
      console.log(response);
    });
  }
}
