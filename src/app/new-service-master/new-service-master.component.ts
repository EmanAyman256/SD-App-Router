import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NavigationExtras, Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import { ServiceMaster } from './new-service-master.model';
import { ServiceMasterService } from './new-service-master.service';
import { Subscription } from 'rxjs';
import { ApiService } from '../shared/ApiService.service';

interface Column {
  field: string;
  header: string;
}


@Component({
  selector: 'app-new-service-master',
  templateUrl: './new-service-master.component.html',
  styleUrls: ['./new-service-master.component.css'],
  
  providers: [MessageService, ConfirmationService, ServiceMasterService]
})
export class NewServiceMasterComponent {

  
      subscription!: Subscription;
      serviceMasterRecords!: ServiceMaster[];
      filteredRecords: ServiceMaster[] = this.serviceMasterRecords;
      // to change Columns View 
      cols!: Column[];
      selectedColumns!: Column[];
      // to handel checkbox selection:
      selectedRecord: ServiceMaster | null = null;
      selectedRecords: any[] = [];
      editMode = false;
  
      constructor(private apiService: ApiService, private serviceMasterService: ServiceMasterService,
          private router: Router, private cd: ChangeDetectorRef) { }
  
      ngOnInit() {
          this.serviceMasterService.getRecords();
          this.subscription = this.serviceMasterService.recordsChanged.subscribe((records: ServiceMaster[]) => {
              this.serviceMasterRecords = records;
              this.filteredRecords = records.sort((a, b) => b.serviceNumberCode - a.serviceNumberCode);
          });
          this.cd.markForCheck();
          this.cols = [
              { field: 'serviceNumberCode', header: 'Service Master Code' },
              { field: 'searchTerm', header: 'Search Term' },
              { field: 'description', header: 'Description' },
              { field: 'lastChangeDate', header: 'Last Change Date' },
              { field: 'serviceTypeCode', header: 'Service Type' }
          ];
          this.selectedColumns = this.cols;
      }
  
      onRecordSelectionChange(event: any, record: any) {
          if (event.checked) {
              this.selectedRecord = record
              // Add the record to the selectedRecords array if it's not already present
              if (!this.selectedRecords.includes(record)) {
                  this.selectedRecords.push(record);
              }
          } else {
              // Remove the record from the selectedRecords array
              const index = this.selectedRecords.indexOf(record);
              if (index !== -1) {
                  this.selectedRecords.splice(index, 1);
              }
          }
      }
      // To handle Search Input 
      searchValue: string = '';
      onSearchInputChange(): void {
          const keyword = this.searchValue
          if (keyword !== '') {
              this.apiService.get<ServiceMaster[]>('servicenumbers/search', keyword).subscribe(response => {
                  console.log(response);
                  this.filteredRecords = response
              });
          }
          else {
              this.filteredRecords = this.serviceMasterRecords;
          }
      }
  
      onColumnSelectionChange() {
          this.selectedColumns = this.cols.filter(col => this.selectedColumns.includes(col));
      }
  
      navigateEditService() {
          const navigationExtras: NavigationExtras = {
              state: {
                  Record: this.selectedRecord,
              }
          };
          if (this.selectedRecords.length > 0) {
              this.router.navigate(['/add-edit-servicemaster'], navigationExtras);
          }
      }
      navigateCopyService() {
          const navigationExtras: NavigationExtras = {
              state: {
                  Record: this.selectedRecord,
                  Copy: true
              }
          };
          if (this.selectedRecords.length > 0) {
              this.router.navigate(['/add-edit-servicemaster'], navigationExtras);
          }
      }
      navigateAddServices() {
          this.router.navigate(['/add-edit-servicemaster']);
      }

      navigateDetailServices() {
          const navigationExtras: NavigationExtras = {
              state: {
                  RecordDetails: this.selectedRecord,
              }
          };
          if (this.selectedRecords.length > 0) {
              this.router.navigate(['/detail-servicemaster'], navigationExtras);
          }
      }
      // Export Service Master Data to Excel Sheet
      exportExcel() {
          import('xlsx').then((xlsx) => {
              const selectedRows = this.selectedRecords.length > 0 ? this.selectedRecords : this.serviceMasterRecords;
              const worksheet = xlsx.utils.json_to_sheet(selectedRows);
              const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
              const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
              this.saveAsExcelFile(excelBuffer, 'services');
          });
      }
      saveAsExcelFile(buffer: any, fileName: string): void {
          let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
          let EXCEL_EXTENSION = '.xlsx';
          const data: Blob = new Blob([buffer], {
              type: EXCEL_TYPE
          });
          FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
      }
}
