import { Component, OnInit, ViewChild } from '@angular/core';
import { ModelService } from './model.service';
import { ModelEntity } from './model.model';
import { NgForm, FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NavigationExtras, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from '../shared/ApiService.service';

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.css'],
  providers: [ModelService, MessageService, ConfirmationService]
})
export class ModelComponent implements OnInit {

  records!: ModelEntity[];
  @ViewChild('f', { static: false })
  slForm!: NgForm;

  modalVisible: boolean = false;
  subscription!: Subscription;

  recordsCurrency!: any[];
  selectedCurrency!: number;

  constructor(private apiService: ApiService, private modelService: ModelService, private messageService: MessageService, private confirmationService: ConfirmationService, private modalService: NgbModal, private fb: FormBuilder,
    private router: Router) {
  }

  ngOnInit() {
    this.modelService.getRecords();
    this.subscription = this.modelService.recordsChanged.subscribe((records: ModelEntity[]) => {
      this.records = records.sort((a, b) => b.modelSpecCode - a.modelSpecCode);
    });

    this.apiService.get<any[]>('currencies').subscribe(response => {
      this.recordsCurrency = response;
    });
  }

  navigateModelAdd() {
    this.router.navigate(['/add-model']);
  }
  
  deleteDialog: boolean = false;

  showDeleteDialog() {
    this.deleteDialog = true;
  }

  editMode = false;
  clonedRecords: { [s: number]: ModelEntity; } = {};

  onRowEditInit(record: ModelEntity) {
    this.clonedRecords[record.modelSpecCode] = { ...record };
  }

  onRowEditSave(index: number, record: ModelEntity) {
    this.modelService.updateRecord(index, record);
    this.ngOnInit(); 
    this.editMode = false;
    delete this.clonedRecords[record.modelSpecCode];
    this.messageService.add({ severity: 'success', summary: 'Success', detail: `Model ${record.modelSpecCode} Updated Successfully` });
  }

  onRowEditCancel(record: ModelEntity, index: number) {
    this.records[index] = this.clonedRecords[record.modelSpecCode];
    delete this.clonedRecords[record.modelSpecCode];
  }

  navigateServices(record: ModelEntity) {
    const navigationExtras: NavigationExtras = {
      state: {
        Record: record
      }
    };
    this.router.navigate(['/modelSpecDetails'], navigationExtras);
  }

  deleteRecord(record: ModelEntity) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected record?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService.delete<ModelEntity>('modelspecs', record.modelSpecCode).subscribe(response => {
          console.log('model spec deleted:', response);
          this.modelService.getRecords();
        });
        this.messageService.add({ severity: 'success', summary: 'Successfully', detail: 'Deleted', life: 3000 });
      }
    });
  }

}

