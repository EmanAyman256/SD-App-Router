import { Component, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ModelSpecDetailService } from './model-details.service';
import { ModelSpecDetails } from './model-details.model';
import { ModelEntity } from '../model/model.model';
import { Router } from '@angular/router';
import { ApiService } from '../shared/ApiService.service';
import { Subscription, forkJoin } from 'rxjs';
import { ServiceType } from '../service-type/service-type.model';
import { UnitOfMeasure } from '../models/unitOfMeasure.model';
import { PersonnelNumber } from '../models/personnelNumber.model';
import { Formula } from '../formulas/formulas.model';
import { ServiceMaster } from '../new-service-master/new-service-master.model';

@Component({
  selector: 'app-model-details',
  templateUrl: './model-details.component.html',
  styleUrls: ['./model-details.component.css'],
  providers: [ModelSpecDetailService, MessageService, ConfirmationService]
})
export class ModelDetailsComponent {

  subscription!: Subscription;
  records: ModelSpecDetails[] = [];
  public rowIndex = 0;
  searchTerm!: number;
  dontSelectServiceNumber: boolean = true
  modelSpecRecord?: ModelEntity // hold ModelSpecRecord from previous screen
  currency: any
  totalValue: number = 0.0
  //fields for dropdown lists
  recordsServiceNumber!: ServiceMaster[];
  selectedServiceNumberRecord?: ServiceMaster
  selectedServiceNumber!: number;
  updateSelectedServiceNumber!: number
  updateSelectedServiceNumberRecord?: ServiceMaster
  shortText: string = '';
  updateShortText: string = '';
  shortTextChangeAllowed: boolean = false;
  updateShortTextChangeAllowed: boolean = false;
  recordsUnitOfMeasure!: UnitOfMeasure[];
  selectedUnitOfMeasure!: string;
  recordsServiceType!: ServiceType[];
  selectedServiceType!: string;
  recordsPersonnelNumber!: PersonnelNumber[];
  selectedPersonnelNumber!: string;
  recordsFormula!: any[];
  selectedFormula!: string;
  recordsMatGrp!: any[];
  selectedMatGrp!: string;
  recordsLineType!: any[];
  selectedLineType!: string;
  modelSpecDetailsCodes: number[] = []

  constructor(private apiService: ApiService, private router: Router, private modelSpecDetailsService: ModelSpecDetailService, private messageService: MessageService, private confirmationService: ConfirmationService,) {
    this.modelSpecRecord = this.router.getCurrentNavigation()?.extras.state?.['Record'];
    if (this.modelSpecRecord) {
      this.modelSpecDetailsCodes = this.modelSpecRecord.modelSpecDetailsCode
    }
    else {
      this.modelSpecRecord = undefined
    }
  }

  ngOnInit() {
    if (this.modelSpecRecord) {
      console.log(this.modelSpecRecord);

      const detailObservables = this.modelSpecRecord.modelSpecDetailsCode.map(code =>
        this.apiService.getID<ModelSpecDetails>('modelspecdetails', code)
      );
      forkJoin(detailObservables).subscribe(records => {
        this.records = records.sort((a, b) => b.modelSpecDetailsCode - a.modelSpecDetailsCode);
        // const filteredRecords = records.filter(record => record.deletionIndicator != true);
        this.totalValue = records.reduce((sum, record) => sum + record.netValue, 0);
        console.log('Total Value:', this.totalValue);
      });
    }
    this.apiService.get<ServiceMaster[]>('servicenumbers').subscribe(response => {
      this.recordsServiceNumber = response.filter(record => record.deletionIndicator === false);
    });
    this.apiService.get<UnitOfMeasure[]>('measurements').subscribe(response => {
      this.recordsUnitOfMeasure = response;
    });
    this.apiService.get<ServiceType[]>('servicetypes').subscribe(response => {
      this.recordsServiceType = response;
    });
    this.apiService.get<PersonnelNumber[]>('personnelnumbers').subscribe(response => {
      this.recordsPersonnelNumber = response;
    });
    this.apiService.get<any[]>('linetypes').subscribe(response => {
      this.recordsLineType = response;
    });
    this.apiService.get<any[]>('formulas').subscribe(response => {
      this.recordsFormula = response;
    });
    this.apiService.get<any[]>('materialgroups').subscribe(response => {
      this.recordsMatGrp = response;
    });
  }

  public isMatch(record: any, ri: number): boolean {
    if (!this.searchTerm) {
      return true; // Display all records when search term is empty
    }
    const searchString = this.rowIndex + ri + 1;
    return searchString === this.searchTerm;
  }

  //Display Line Details:
  selectedDetailsForDisplay?: ModelSpecDetails
  visible: boolean = false;
  showDialog() {
    this.visible = true;
  }
  // to handle selection checkbox
  selectedRecords: ModelSpecDetails[] = [];
  onRecordSelectionChange(event: any, record: ModelSpecDetails) {
    this.selectedDetailsForDisplay = record
    this.selectedRecords = event.checked
  }
  // to handle All Records Selection / Deselection 
  selectedAllRecords: ModelSpecDetails[] = [];
  onSelectAllRecords(event: any): void {
    if (Array.isArray(event.checked) && event.checked.length > 0) {
      this.selectedAllRecords = [...this.records];
    } else {
      this.selectedAllRecords = [];
    }
  }

  selectedFormulaRecord: any
  updatedFormula!: number;
  updatedFormulaRecord: any

  onFormulaSelect(event: any) {
    const selectedRecord = this.recordsFormula.find(record => record.formula === this.selectedFormula);
    if (selectedRecord) {
      this.selectedFormulaRecord = selectedRecord
    }
    else {
      console.log("no Formula");
      this.selectedFormulaRecord = undefined;
    }
  }

  onFormulaUpdateSelect(event: any) {
    const selectedRecord = this.recordsFormula.find(record => record.formula === event.value);
    if (selectedRecord) {
      this.updatedFormulaRecord = selectedRecord
    }
    else {
      this.updatedFormulaRecord = undefined;
      console.log(this.updatedFormulaRecord);
    }
  }
  //In Creation to handle shortTextChangeAlowlled Flag 
  onServiceNumberChange(event: any) {
    const selectedRecord = this.recordsServiceNumber.find(record => record.serviceNumberCode === this.selectedServiceNumber);
    if (selectedRecord) {
      this.selectedServiceNumberRecord = selectedRecord
      this.shortTextChangeAllowed = this.selectedServiceNumberRecord?.shortTextChangeAllowed || false;
      this.shortText = ""
    }
    else {
      console.log("no service number");
      this.dontSelectServiceNumber = false
      this.selectedServiceNumberRecord = undefined;
    }
  }
  //In Update to handle shortTextChangeAlowlled Flag 
  onServiceNumberUpdateChange(event: any) {
    const updateSelectedRecord = this.recordsServiceNumber.find(record => record.serviceNumberCode === event.value);
    if (updateSelectedRecord) {
      this.updateSelectedServiceNumberRecord = updateSelectedRecord
      this.updateShortTextChangeAllowed = this.updateSelectedServiceNumberRecord?.shortTextChangeAllowed || false;
      this.updateShortText = ""
    }
    else {
      this.updateSelectedServiceNumberRecord = undefined;
    }
  }
  // handle Deletion Record/ Records
  deleteRecord() {
    if (this.selectedRecords.length) {
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete the selected record?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          for (const record of this.selectedRecords) {
            console.log(this.modelSpecRecord);
            const updatedRecord: ModelSpecDetails = {
              ...record, // Copy all properties from the original record
              deletionIndicator: true
            }
            console.log(updatedRecord);

            if (this.modelSpecRecord) {
              const indexToRemove = this.modelSpecRecord.modelSpecDetailsCode.indexOf(updatedRecord.modelSpecDetailsCode);
              console.log(indexToRemove);
              
              if (indexToRemove !== -1) {
                this.modelSpecRecord.modelSpecDetailsCode.splice(indexToRemove, 1);
              }
              console.log(this.modelSpecRecord);
              this.apiService.put<ModelEntity>('modelspecs', this.modelSpecRecord.modelSpecCode, this.modelSpecRecord).subscribe({
                next: (res) => {
                  console.log('Model updated and delete from it modelspec details:', res);
                  this.totalValue = 0;
                  this.ngOnInit();
                }
                , error: (err) => {
                  console.log(err);
                },
                complete: () => {
                }

              });
            }
            // this.apiService.put<ModelSpecDetails>('modelspecdetails', record.modelSpecDetailsCode, updatedRecord).subscribe(response => {
            //   console.log('model spec marked deleted and updated in DB:', response);
            //   this.totalValue = 0;
            //   this.ngOnInit();
            // });
           
          }
          this.messageService.add({ severity: 'success', summary: 'Successfully', detail: 'Deleted', life: 3000 });
          this.selectedRecords = []; // Clear the selectedRecords array after deleting all records
        }
      });
    }
    if (this.selectedAllRecords.length > 0) {
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete the selected record?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          for (const record of this.selectedAllRecords) {
            const updatedRecord: ModelSpecDetails = {
              ...record, // Copy all properties from the original record
              deletionIndicator: true
            }
            console.log(updatedRecord);

            if (this.modelSpecRecord) {
              const indexToRemove = this.modelSpecRecord.modelSpecDetailsCode.indexOf(updatedRecord.modelSpecDetailsCode);
              console.log(indexToRemove);
              
              if (indexToRemove !== -1) {
                this.modelSpecRecord.modelSpecDetailsCode.splice(indexToRemove, 1);
              }
              console.log(this.modelSpecRecord);
              this.apiService.put<ModelEntity>('modelspecs', this.modelSpecRecord.modelSpecCode, this.modelSpecRecord).subscribe({
                next: (res) => {
                  console.log('Model updated and delete from it modelspec details:', res);
                  this.totalValue = 0;
                  this.ngOnInit();
                }
                , error: (err) => {
                  console.log(err);
                },
                complete: () => {
                }

              });
            }

            // this.apiService.put<ModelSpecDetails>('modelspecdetails', record.modelSpecDetailsCode, updatedRecord).subscribe(response => {
            //   console.log('model spec marked deleted and updated in DB:', response);
            //   this.totalValue = 0;
            //   this.ngOnInit()
            // });
          }
          this.messageService.add({ severity: 'success', summary: 'Successfully', detail: 'Deleted', life: 3000 });
          this.selectedAllRecords = [];
        }
      });
    }
  }
  // For Edit 
  clonedModelSpecDetails: { [s: number]: ModelSpecDetails } = {};
  onRowEditInit(record: ModelSpecDetails) {
    this.clonedModelSpecDetails[record.modelSpecDetailsCode] = { ...record };
  }
  onRowEditSave(index: number, record: ModelSpecDetails) {
    console.log(this.updateSelectedServiceNumber);
    if (this.updateSelectedServiceNumberRecord) {
      const newRecord: ModelSpecDetails = {
        ...record, // Copy all properties from the original record
        // Modify specific attributes
        unitOfMeasurementCode: this.updateSelectedServiceNumberRecord.baseUnitOfMeasurement,
        materialGroupCode: this.updateSelectedServiceNumberRecord.materialGroupCode,
        serviceTypeCode: this.updateSelectedServiceNumberRecord.serviceTypeCode,
        shortText: this.updateSelectedServiceNumberRecord.description,
        serviceText: this.updateSelectedServiceNumberRecord.serviceText,
      };
      console.log(newRecord);
      this.apiService.put<ModelSpecDetails>('modelspecdetails', index, newRecord).subscribe(response => {
        console.log('modelspecDetail updated:', response);
        if (response) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Record is updated' });
        }
        else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Data' });
        }
        console.log(this.totalValue)
        this.totalValue = 0;
        this.ngOnInit()
      });
    }
    if (this.updateSelectedServiceNumberRecord && this.updatedFormulaRecord && this.resultAfterTestUpdate) {
      console.log(record);
      console.log(this.updateSelectedServiceNumberRecord);
      const newRecord: ModelSpecDetails = {
        ...record,
        unitOfMeasurementCode: this.updateSelectedServiceNumberRecord.baseUnitOfMeasurement,
        materialGroupCode: this.updateSelectedServiceNumberRecord.materialGroupCode,
        serviceTypeCode: this.updateSelectedServiceNumberRecord.serviceTypeCode,
        shortText: this.updateSelectedServiceNumberRecord.description,
        serviceText: this.updateSelectedServiceNumberRecord.serviceText,
        quantity: this.resultAfterTestUpdate,
      };
      console.log(newRecord);
      this.apiService.put<ModelSpecDetails>('modelspecdetails', index, newRecord).subscribe(response => {
        console.log('modelspecDetail updated:', response);
        if (response) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Record is updated' });
        }
        else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Data' });
        }
        console.log(this.totalValue)
        this.totalValue = 0;
        this.ngOnInit()
        console.log(this.totalValue)
      });
    }
    if (this.updatedFormulaRecord && this.resultAfterTestUpdate) {
      const newRecord: ModelSpecDetails = {
        ...record,
        quantity: this.resultAfterTestUpdate,
      };
      console.log(newRecord);
      this.apiService.put<ModelSpecDetails>('modelspecdetails', index, newRecord).subscribe(response => {
        console.log('modelspecDetail updated:', response);
        if (response) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Record is updated' });
        }
        else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Data' });
        }
        console.log(this.totalValue)
        this.totalValue = 0;
        this.ngOnInit()
        console.log(this.totalValue)
      });
    }
    if (!this.updateSelectedServiceNumberRecord && !this.updatedFormulaRecord && !this.resultAfterTestUpdate) {
      this.apiService.put<ModelSpecDetails>('modelspecdetails', index, record).subscribe(response => {
        console.log('modelspecDetail updated:', response);
        if (response) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Record is updated' });
        }
        else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Data' });
        }
        this.totalValue = 0;
        //this.modelSpecDetailsService.getRecords();
        this.ngOnInit()
      });
    }
  }
  onRowEditCancel(row: ModelSpecDetails, index: number) {
    this.records[index] = this.clonedModelSpecDetails[row.modelSpecDetailsCode]
    delete this.clonedModelSpecDetails[row.modelSpecDetailsCode]
  }
  // For Add new Record
  newService: ModelSpecDetails = {
    serviceNumberCode: 0,
    lineTypeCode: '',
    unitOfMeasurementCode: '',
    currencyCode: '',
    personnelNumberCode: '',
    serviceTypeCode: '',
    materialGroupCode: '',
    formulaCode: '',
    selectionCheckbox: false,
    lineIndex: 0,
    deletionIndicator: false,
    shortText: '',
    quantity: 0,
    grossPrice: 0,
    overFulfilmentPercentage: 0,
    priceChangedAllowed: false,
    unlimitedOverFulfillment: false,
    pricePerUnitOfMeasurement: 0,
    externalServiceNumber: '',
    netValue: 0,
    serviceText: '',
    lineText: '',
    lineNumber: '',
    alternatives: '',
    biddersLine: false,
    supplementaryLine: false,
    lotSizeForCostingIsOne: false,
    modelSpecDetailsCode: 0
  };
  addRow() {
    if (!this.selectedServiceNumberRecord && !this.selectedFormulaRecord) { // if user didn't select serviceNumber && didn't select formula
      const newRecord = {
        //serviceNumberCode: this.selectedServiceNumber,
        lineTypeCode: this.selectedLineType,
        unitOfMeasurementCode: this.selectedUnitOfMeasure,
        currencyCode: this.modelSpecRecord?.currencyCode,
        personnelNumberCode: this.selectedPersonnelNumber,
        serviceTypeCode: this.selectedServiceType,
        materialGroupCode: this.selectedMatGrp,
        formulaCode: this.selectedFormula,
        deletionIndicator: this.newService.deletionIndicator,
        shortText: this.newService.shortText,
        quantity: this.newService.quantity,
        grossPrice: this.newService.grossPrice,
        overFulfilmentPercentage: this.newService.overFulfilmentPercentage,
        priceChangedAllowed: this.newService.priceChangedAllowed,
        unlimitedOverFulfillment: this.newService.unlimitedOverFulfillment,
        pricePerUnitOfMeasurement: this.newService.pricePerUnitOfMeasurement,
        externalServiceNumber: this.newService.externalServiceNumber,
        netValue: this.newService.netValue,
        serviceText: this.newService.serviceText,
        lineText: this.newService.lineText,
        lineNumber: this.newService.lineNumber,
        alternatives: this.newService.alternatives,
        biddersLine: this.newService.biddersLine,
        supplementaryLine: this.newService.supplementaryLine,
        lotSizeForCostingIsOne: this.newService.lotSizeForCostingIsOne,
      }
      if (this.newService.quantity === 0 || this.newService.grossPrice === 0) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Quantity and GrossPrice are required',
          life: 3000
        });
      }
      console.log(newRecord);
      // Remove properties with empty or default values
      const filteredRecord = Object.fromEntries(
        Object.entries(newRecord).filter(([_, value]) => {
          return value !== '' && value !== 0 && value !== undefined && value !== null;
        })
      );
      console.log(filteredRecord);
      this.apiService.post<ModelSpecDetails>('modelspecdetails', filteredRecord).subscribe((response: ModelSpecDetails) => {
        console.log('modelspecdetails created:', response);
        if (response) {
          this.resetNewService();
          console.log(this.newService);

          const newDetail = response;
          if (this.modelSpecRecord) {
            this.modelSpecRecord.modelSpecDetailsCode.push(newDetail.modelSpecDetailsCode);
            this.apiService.put<ModelEntity>('modelspecs', this.modelSpecRecord.modelSpecCode, this.modelSpecRecord).subscribe(updatedModel => {
              console.log('Model updated:', updatedModel);
            });
          }
        }
        console.log(response);
        this.totalValue = 0;
        // this.modelSpecDetailsService.getRecords();
        this.ngOnInit()
      });
    }
    else if (!this.selectedServiceNumberRecord && this.selectedFormulaRecord && this.resultAfterTest) { // if user didn't select serviceNumber && select formula
      const newRecord = {
        //serviceNumberCode: this.selectedServiceNumber,
        lineTypeCode: this.selectedLineType,
        unitOfMeasurementCode: this.selectedUnitOfMeasure,
        currencyCode: this.modelSpecRecord?.currencyCode,
        personnelNumberCode: this.selectedPersonnelNumber,
        serviceTypeCode: this.selectedServiceType,
        materialGroupCode: this.selectedMatGrp,
        formulaCode: this.selectedFormula,
        deletionIndicator: this.newService.deletionIndicator,
        shortText: this.newService.shortText,
        // quantity: this.selectedFormulaRecord.result,
        quantity: this.resultAfterTest,
        grossPrice: this.newService.grossPrice,
        overFulfilmentPercentage: this.newService.overFulfilmentPercentage,
        priceChangedAllowed: this.newService.priceChangedAllowed,
        unlimitedOverFulfillment: this.newService.unlimitedOverFulfillment,
        pricePerUnitOfMeasurement: this.newService.pricePerUnitOfMeasurement,
        externalServiceNumber: this.newService.externalServiceNumber,
        netValue: this.newService.netValue,
        serviceText: this.newService.serviceText,
        lineText: this.newService.lineText,
        lineNumber: this.newService.lineNumber,
        alternatives: this.newService.alternatives,
        biddersLine: this.newService.biddersLine,
        supplementaryLine: this.newService.supplementaryLine,
        lotSizeForCostingIsOne: this.newService.lotSizeForCostingIsOne,
      }
      if (this.resultAfterTest === 0 || this.newService.grossPrice === 0) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Quantity and GrossPrice are required',
          life: 3000
        });
      }
      console.log(newRecord);
      // Remove properties with empty or default values
      const filteredRecord = Object.fromEntries(
        Object.entries(newRecord).filter(([_, value]) => {
          return value !== '' && value !== 0 && value !== undefined && value !== null;
        })
      );
      console.log(filteredRecord);
      this.apiService.post<ModelSpecDetails>('modelspecdetails', filteredRecord).subscribe((response: ModelSpecDetails) => {
        console.log('modelspecdetails created:', response);
        if (response) {
          this.resetNewService();
          this.selectedFormulaRecord = undefined
          console.log(this.newService);

          const newDetail = response;
          if (this.modelSpecRecord) {
            this.modelSpecRecord.modelSpecDetailsCode.push(newDetail.modelSpecDetailsCode);
            this.apiService.put<ModelEntity>('modelspecs', this.modelSpecRecord.modelSpecCode, this.modelSpecRecord).subscribe(updatedModel => {
              console.log('Model updated:', updatedModel);
            });
          }
        }
        console.log(response);
        this.totalValue = 0;
        //this.modelSpecDetailsService.getRecords();
        this.ngOnInit()
      });
    }
    else if (this.selectedServiceNumberRecord && !this.selectedFormulaRecord && !this.resultAfterTest) { // if user select serviceNumber && didn't select formula
      const newRecord = {
        serviceNumberCode: this.selectedServiceNumber,
        lineTypeCode: this.selectedLineType,
        unitOfMeasurementCode: this.selectedServiceNumberRecord.baseUnitOfMeasurement,
        currencyCode: this.modelSpecRecord?.currencyCode,
        personnelNumberCode: this.selectedPersonnelNumber,
        serviceTypeCode: this.selectedServiceNumberRecord.serviceTypeCode,
        materialGroupCode: this.selectedServiceNumberRecord.materialGroupCode,
        formulaCode: this.selectedFormula,
        deletionIndicator: this.newService.deletionIndicator,
        shortText: this.selectedServiceNumberRecord.description,
        // quantity: this.selectedFormulaRecord.result,
        quantity: this.newService.quantity,
        grossPrice: this.newService.grossPrice,
        overFulfilmentPercentage: this.newService.overFulfilmentPercentage,
        priceChangedAllowed: this.newService.priceChangedAllowed,
        unlimitedOverFulfillment: this.newService.unlimitedOverFulfillment,
        pricePerUnitOfMeasurement: this.newService.pricePerUnitOfMeasurement,
        externalServiceNumber: this.newService.externalServiceNumber,
        netValue: this.newService.netValue,
        // netValue: this.resultAfterTest * this.newService.grossPrice,
        serviceText: this.selectedServiceNumberRecord.serviceText,
        lineText: this.newService.lineText,
        lineNumber: this.newService.lineNumber,
        alternatives: this.newService.alternatives,
        biddersLine: this.newService.biddersLine,
        supplementaryLine: this.newService.supplementaryLine,
        lotSizeForCostingIsOne: this.newService.lotSizeForCostingIsOne,
      }
      if (this.newService.quantity === 0 || this.newService.grossPrice === 0) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Quantity and GrossPrice are required',
          life: 3000
        });
      }
      console.log(newRecord);
      // Remove properties with empty or default values
      const filteredRecord = Object.fromEntries(
        Object.entries(newRecord).filter(([_, value]) => {
          return value !== '' && value !== 0 && value !== undefined && value !== null;
        })
      );
      console.log(filteredRecord);
      this.apiService.post<ModelSpecDetails>('modelspecdetails', filteredRecord).subscribe((response: ModelSpecDetails) => {
        console.log('modelspecdetails created:', response);
        if (response) {
          this.resetNewService();
          this.selectedFormulaRecord = undefined
          this.selectedServiceNumberRecord = undefined
          console.log(this.newService);

          const newDetail = response;
          if (this.modelSpecRecord) {
            this.modelSpecRecord.modelSpecDetailsCode.push(newDetail.modelSpecDetailsCode);
            this.apiService.put<ModelEntity>('modelspecs', this.modelSpecRecord.modelSpecCode, this.modelSpecRecord).subscribe(updatedModel => {
              console.log('Model updated:', updatedModel);
            });
          }
        }
        console.log(response);
        this.totalValue = 0;
        //this.modelSpecDetailsService.getRecords();
        this.ngOnInit()
      });
    }
    else if (this.selectedServiceNumberRecord && this.selectedFormulaRecord && this.resultAfterTest) { // if user select serviceNumber && select formula
      const newRecord = {
        serviceNumberCode: this.selectedServiceNumber,
        lineTypeCode: this.selectedLineType,
        unitOfMeasurementCode: this.selectedServiceNumberRecord.baseUnitOfMeasurement,
        currencyCode: this.modelSpecRecord?.currencyCode,
        personnelNumberCode: this.selectedPersonnelNumber,
        serviceTypeCode: this.selectedServiceNumberRecord.serviceTypeCode,
        materialGroupCode: this.selectedServiceNumberRecord.materialGroupCode,
        formulaCode: this.selectedFormula,
        deletionIndicator: this.newService.deletionIndicator,
        shortText: this.selectedServiceNumberRecord.description,
        // quantity: this.selectedFormulaRecord.result,
        quantity: this.resultAfterTest,
        grossPrice: this.newService.grossPrice,
        overFulfilmentPercentage: this.newService.overFulfilmentPercentage,
        priceChangedAllowed: this.newService.priceChangedAllowed,
        unlimitedOverFulfillment: this.newService.unlimitedOverFulfillment,
        pricePerUnitOfMeasurement: this.newService.pricePerUnitOfMeasurement,
        externalServiceNumber: this.newService.externalServiceNumber,
        netValue: this.newService.netValue,
        // netValue: this.resultAfterTest * this.newService.grossPrice,
        serviceText: this.selectedServiceNumberRecord.serviceText,
        lineText: this.newService.lineText,
        lineNumber: this.newService.lineNumber,
        alternatives: this.newService.alternatives,
        biddersLine: this.newService.biddersLine,
        supplementaryLine: this.newService.supplementaryLine,
        lotSizeForCostingIsOne: this.newService.lotSizeForCostingIsOne,
      }
      if (this.resultAfterTest === 0 || this.newService.grossPrice === 0) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Quantity and GrossPrice are required',
          life: 3000
        });
      }
      console.log(newRecord);
      // Remove properties with empty or default values
      const filteredRecord = Object.fromEntries(
        Object.entries(newRecord).filter(([_, value]) => {
          return value !== '' && value !== 0 && value !== undefined && value !== null;
        })
      );
      console.log(filteredRecord);
      this.apiService.post<ModelSpecDetails>('modelspecdetails', filteredRecord).subscribe((response: ModelSpecDetails) => {
        console.log('modelspecdetails created:', response);
        if (response) {
          this.resetNewService();
          this.selectedFormulaRecord = undefined
          this.selectedServiceNumberRecord = undefined
          console.log(this.newService);

          const newDetail = response;
          if (this.modelSpecRecord) {
            this.modelSpecRecord.modelSpecDetailsCode.push(newDetail.modelSpecDetailsCode);
            this.apiService.put<ModelEntity>('modelspecs', this.modelSpecRecord.modelSpecCode, this.modelSpecRecord).subscribe(updatedModel => {
              console.log('Model updated:', updatedModel);
            });
          }
        }
        console.log(response);
        this.totalValue = 0;
        //this.modelSpecDetailsService.getRecords();
        this.ngOnInit()
      });
    }
  }

  resetNewService() {
    this.newService = {
      serviceNumberCode: 0,
      lineTypeCode: '',
      unitOfMeasurementCode: '',
      currencyCode: '',
      personnelNumberCode: '',
      serviceTypeCode: '',
      materialGroupCode: '',
      formulaCode: '',
      selectionCheckbox: false,
      lineIndex: 0,
      deletionIndicator: false,
      shortText: '',
      quantity: 0,
      grossPrice: 0,
      overFulfilmentPercentage: 0,
      priceChangedAllowed: false,
      unlimitedOverFulfillment: false,
      pricePerUnitOfMeasurement: 0,
      externalServiceNumber: '',
      netValue: 0,
      serviceText: '',
      lineText: '',
      lineNumber: '',
      alternatives: '',
      biddersLine: false,
      supplementaryLine: false,
      lotSizeForCostingIsOne: false,
      modelSpecDetailsCode: 0
    };
    this.selectedUnitOfMeasure = '';
    this.selectedPersonnelNumber = '';
    this.selectedLineType = '';
    this.selectedServiceType = '';
    this.selectedMatGrp = '';
    this.selectedFormula = '';
  }

  // handle Formula Parameters 
  showPopup: boolean = false;
  parameterValues: { [key: string]: number } = {};
  showPopupUpdate: boolean = false;
  parameterValuesUpdate: { [key: string]: number } = {};
  openPopup() {
    if (this.selectedFormulaRecord) {
      this.showPopup = true;
      for (const parameterId of this.selectedFormulaRecord.parameterIds) {
        this.parameterValues[parameterId] = 0;
        console.log(this.parameterValues);
      }
    }
    else {
      this.showPopup = false;
    }
  }
  openPopupUpdate() {
    if (this.updatedFormulaRecord) {
      this.showPopupUpdate = true;
      console.log(this.showPopupUpdate);

      for (const parameterId of this.updatedFormulaRecord.parameterIds) {
        this.parameterValuesUpdate[parameterId] = 0;
        console.log(this.parameterValuesUpdate);
      }
    }
    else {
      this.showPopupUpdate = false;
    }
  }
  resultAfterTest!: number
  resultAfterTestUpdate!: number
  saveParameters() {
    if (this.selectedFormulaRecord) {
      console.log(this.parameterValues);
      const valuesOnly = Object.values(this.parameterValues)
        .filter(value => typeof value === 'number') as number[];
      console.log(valuesOnly);
      console.log(this.resultAfterTest);

      const formulaObject: any = {
        formula: this.selectedFormulaRecord.formula,
        description: this.selectedFormulaRecord.description,
        numberOfParameters: this.selectedFormulaRecord.numberOfParameters,
        parameterIds: this.selectedFormulaRecord.parameterIds,
        parameterDescriptions: this.selectedFormulaRecord.parameterDescriptions,
        formulaLogic: this.selectedFormulaRecord.formulaLogic,
        testParameters: valuesOnly
      };
      console.log(formulaObject);
      this.apiService.put<any>('formulas', this.selectedFormulaRecord.formulaCode, formulaObject).subscribe((response: Formula) => {
        console.log('formula updated:', response);
        this.resultAfterTest = response.result;
        console.log(this.resultAfterTest);
      });
      this.showPopup = false;
    }
    if (this.updatedFormulaRecord) {
      console.log(this.parameterValuesUpdate);
      const valuesOnly = Object.values(this.parameterValuesUpdate)
        .filter(value => typeof value === 'number') as number[];
      console.log(valuesOnly);
      console.log(this.resultAfterTestUpdate);
      const formulaObject: any = {
        formula: this.updatedFormulaRecord.formula,
        description: this.updatedFormulaRecord.description,
        numberOfParameters: this.updatedFormulaRecord.numberOfParameters,
        parameterIds: this.updatedFormulaRecord.parameterIds,
        parameterDescriptions: this.updatedFormulaRecord.parameterDescriptions,
        formulaLogic: this.updatedFormulaRecord.formulaLogic,
        testParameters: valuesOnly
      };
      console.log(formulaObject);
      this.apiService.put<any>('formulas', this.updatedFormulaRecord.formulaCode, formulaObject).subscribe((response: Formula) => {
        console.log('formula updated:', response);
        this.resultAfterTestUpdate = response.result;
        console.log(this.resultAfterTestUpdate);

      });
      this.showPopupUpdate = false;
    }

  }

  closePopup() {
    this.showPopupUpdate = false;
    this.showPopup = false;
  }
}
