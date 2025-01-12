import { Component, ViewChild } from '@angular/core';
import { ServiceTypeService } from './service-type.service';
import { ServiceType } from './service-type.model';
import { Subscription } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from '../shared/ApiService.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-service-type',
  templateUrl: './service-type.component.html',
  styleUrls: ['./service-type.component.css'],
  providers: [ServiceTypeService, MessageService, ConfirmationService]
})
export class ServiceTypeComponent {

  records!: ServiceType[];
  private subscription!: Subscription;
  editMode = false;

  constructor(private apiService: ApiService, private _ServiceTypeService: ServiceTypeService, private messageService: MessageService, private confirmationService: ConfirmationService) { }

  ngOnInit() {

    this._ServiceTypeService.getApiRecords();
    this.subscription = this._ServiceTypeService.recordsChanged.subscribe((records: ServiceType[]) => {
      // Sort the records 
      this.records = records.sort((a, b) => b.serviceTypeCode - a.serviceTypeCode);
    });
  }

  onEditItem(index: number) {
    this._ServiceTypeService.startedEditing.next(index);
  }
  
  clonedRecords: { [s: number]: ServiceType; } = {};

  onRowEditInit(record: ServiceType) {
    this.clonedRecords[record.serviceTypeCode] = { ...record };
  }

  onRowEditSave(index: number, record: ServiceType) {
    this._ServiceTypeService.updateRecord(index, record);
    this.ngOnInit(); //reload the table
    this.editMode = false;
    delete this.clonedRecords[record.serviceTypeCode];
    this.messageService.add({ severity: 'success', summary: 'Success', detail: `ServiceType Updated Successfully` });
  }

  onRowEditCancel(record: ServiceType, index: number) {
    this.records[index] = this.clonedRecords[record.serviceTypeCode];
    delete this.clonedRecords[record.serviceTypeCode];
  }

  deleteRecord(record: ServiceType) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected record?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService.delete<ServiceType>('servicetypes', record.serviceTypeCode).subscribe(response => {
          console.log('service type deleted:', response);
          this._ServiceTypeService.getApiRecords();
        });
        this.messageService.add({ severity: 'success', summary: 'Successfully', detail: 'Deleted', life: 3000 });
      }
    });
  }

  newServiceType: ServiceType = {
    serviceTypeCode: 0,
    serviceId: '',
    description: '',
    lastChangeDate: new Date(),
  }
  addRow() {

    const newRecord = {
      serviceId: this.newServiceType.serviceId,
      description: this.newServiceType.description
    }
    const filteredRecord = Object.fromEntries(
      Object.entries(newRecord).filter(([_, value]) => {
        return value !== '' && value !== undefined;
      })
    );
    this.apiService.post<ServiceType>('servicetypes', filteredRecord).subscribe(
      (response: ServiceType) => {
        console.log('ServiceType created:', response);
        if (response) {
          this.resetNewService();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: `ServiceType Added Successfully` });
        }
        this.ngOnInit();
      },
      (error: HttpErrorResponse) => {
        if (error.status === 409) {
          // Handle conflict error
          console.log('Conflict error:', error);
          this.messageService.add({ severity: 'error', summary: 'Code Conflict', detail: 'This Code already exists', life: 10000 });
          this.ngOnInit();
        } else {
          console.error('An error occurred:', error);
        }
      }
    );

  }

  resetNewService() {
    this.newServiceType = {
      serviceTypeCode: 0,
      serviceId: '',
      description: '',
      lastChangeDate: new Date(),
    };
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
