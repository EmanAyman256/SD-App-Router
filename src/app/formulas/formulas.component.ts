import { Component } from '@angular/core';
import { FormulasService } from './formulas.service';
import { Formula } from './formulas.model';
import { Subscription } from 'rxjs';
import { ApiService } from '../shared/ApiService.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-formulas',
  templateUrl: './formulas.component.html',
  styleUrls: ['./formulas.component.css'],
  
  providers: [FormulasService,MessageService,ConfirmationService]
})
export class FormulasComponent {

  records!: Formula[];
  subscription!: Subscription;
  constructor(private apiService: ApiService, private formulasService: FormulasService,
     private messageService: MessageService, private confirmationService: ConfirmationService,private router: Router) { }
  ngOnInit() {
    console.log(this.formulasService.getApiRecords());
    this.formulasService.getApiRecords();
    this.subscription = this.formulasService.recordsChanged.subscribe((records: Formula[]) => {
      this.records =  records.sort((a, b) => b.formulaCode - a.formulaCode);
      console.log(this.records);
    });
  }

  deleteRecord(record: Formula) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected record?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService.delete<Formula>('formulas', record.formulaCode).subscribe(response => {
          console.log('formula deleted:', response);
          this.formulasService.getApiRecords();
        });
        this.messageService.add({ severity: 'success', summary: 'Successfully', detail: 'Deleted', life: 3000 });
      }
    });
  }

  navigateAddFormula(){
    this.router.navigate(['/formula']);
  }
  selectedDetailsForDisplay?: Formula
  visible: boolean = false;
  showDialog(record: Formula) {
    this.visible = true;
    this.selectedDetailsForDisplay = record
    console.log(this.selectedDetailsForDisplay);
  }
}
