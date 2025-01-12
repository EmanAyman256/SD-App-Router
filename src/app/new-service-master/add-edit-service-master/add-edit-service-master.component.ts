
import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ApiService } from 'src/app/shared/ApiService.service';
import { ServiceMaster } from '../../new-service-master/new-service-master.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceMasterService } from '../new-service-master.service';

@Component({
  selector: 'app-add-edit-service-master',
  templateUrl: './add-edit-service-master.component.html',
  styleUrls: ['./add-edit-service-master.component.css'],
  providers: [ApiService, ServiceMasterService, MessageService, ConfirmationService]
})
export class AddEditServiceMasterComponent implements OnInit {

  serviceMasterForm = new FormGroup({
    serviceNumberCode: new FormControl(0),
    searchTerm: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    serviceText: new FormControl(''),
    shortTextChangeAllowed: new FormControl(false),
    deletionIndicator: new FormControl(false),
    numberToBeConverted: new FormControl(0),
    convertedNumber: new FormControl(0),
    mainItem: new FormControl(false),
    serviceTypeCode: new FormControl('', [Validators.required]),
    materialGroupCode: new FormControl(''),
    baseUnitOfMeasurement: new FormControl(''),
    toBeConvertedUnitOfMeasurement: new FormControl(''),
    defaultUnitOfMeasurement: new FormControl(''),
  });

  editMode = false;
  copyMode = false
  pageId: number = 0;

  serviceMasterInfo: ServiceMaster = {
    serviceNumberCode: 0, searchTerm: '', description: '', serviceText: '', shortTextChangeAllowed: false, deletionIndicator: false,
    numberToBeConverted: 0, convertedNumber: 0, mainItem: false,
    serviceTypeCode: '', materialGroupCode: '',
    baseUnitOfMeasurement: '', toBeConvertedUnitOfMeasurement: '', defaultUnitOfMeasurement: ''
  };

  // Fields of Dropdowns:
  recordsServiceType!: any[];
  selectedServiceType!: number;
  recordsMeasure!: any[];
  selectedBaseMeasure!: number;
  baseUnitOfMeasurement!: string;
  selectedToBeConvertedMeasure!: string;
  selectedConvertedMeasure!: string;
  recordsMaterialGrp!: any[];
  selectedMaterialGrp!: number;

  constructor(private apiService: ApiService, private serviceMasterService: ServiceMasterService
    , private messageService: MessageService, private router: Router, private confirmationService: ConfirmationService, private route: ActivatedRoute) {

    if (this.router.getCurrentNavigation()?.extras.state) {
      const state = this.router.getCurrentNavigation()?.extras.state?.['Record'];
      const copyFlag = this.router.getCurrentNavigation()?.extras.state?.['Copy'];
      if (copyFlag) {
        this.serviceMasterInfo = state;
        this.copyMode = copyFlag;
        this.pageId = state?.serviceNumberCode;
        console.log(this.serviceMasterInfo);

      } else {
        this.serviceMasterInfo = state;
        this.editMode = true;
        this.pageId = state?.serviceNumberCode;
        console.log(this.serviceMasterInfo);
        
      }
    }
  }

  ngOnInit() {
    this.apiService.get<any[]>('servicetypes').subscribe(response => {
      this.recordsServiceType = response;
    });
    this.apiService.get<any[]>('measurements').subscribe(response => {
      this.recordsMeasure = response;
    });
    this.apiService.get<any[]>('materialgroups').subscribe(response => {
      this.recordsMaterialGrp = response;
    });

    if (this.editMode || this.copyMode) {
      this.getServiceMasterById(this.pageId)
    }
  }

  getServiceMasterById(id: number) {
      // this.apiService.getID<ServiceMaster>('servicenumbers',id).subscribe({
      // next: (res: ServiceMaster) => {
      //   console.log(res);
      //   this.serviceMasterInfo = res;
      // }, error: (err: any) => {
      //   console.log(err);

      // }, complete: () => {
      if(this.serviceMasterInfo){
        this.serviceMasterForm.patchValue({
          serviceNumberCode:this.serviceMasterInfo?.serviceNumberCode,
          searchTerm:this.serviceMasterInfo?.searchTerm,
          description:this.serviceMasterInfo?.description,
          serviceText:this.serviceMasterInfo?.serviceText,
          shortTextChangeAllowed:this.serviceMasterInfo?.shortTextChangeAllowed,
          deletionIndicator:this.serviceMasterInfo?.deletionIndicator,
          serviceTypeCode:this.serviceMasterInfo?.serviceTypeCode,
          baseUnitOfMeasurement:this.serviceMasterInfo?.baseUnitOfMeasurement  ,
          numberToBeConverted:this.serviceMasterInfo?.numberToBeConverted,
          toBeConvertedUnitOfMeasurement:this.serviceMasterInfo?.toBeConvertedUnitOfMeasurement,
          convertedNumber:this.serviceMasterInfo?.convertedNumber,
          defaultUnitOfMeasurement:this.serviceMasterInfo?.defaultUnitOfMeasurement,
          mainItem:this.serviceMasterInfo?.mainItem,
          materialGroupCode:this.serviceMasterInfo?.materialGroupCode

        })
      }// end if
     // }
    //})
  }

  onSubmit(form: FormGroup) {
    const value = form.value;
    console.log(value);
    if (this.editMode) {
        this.serviceMasterService.updateRecord(this.pageId, form.value);
        this.serviceMasterService.getRecords();
        this.confirmationService.confirm({
          message: `ServiceMaster ${this.pageId} Updated successfully. Click Yes to go to the Main Page.`,
          header: 'Updated Successfully',
          icon: 'pi pi-check',
          accept: () => {
            this.router.navigate(['/servicemaster']);
          },
          reject: undefined
        });
      
    } else {
      const newRecord = new ServiceMaster(value.searchTerm, value.description,
        value.serviceText, value.shortTextChangeAllowed,
        value.deletionIndicator, value.mainItem, value.numberToBeConverted,
        value.convertedNumber,
        value.serviceTypeCode, value.materialGroupCode,
        value.baseUnitOfMeasurement, value.toBeConvertedUnitOfMeasurement, value.defaultUnitOfMeasurement);

        // Remove properties with empty or default values
        const filteredRecord = Object.fromEntries(
          Object.entries(newRecord).filter(([_, value]) => {
            return value !== '' && value !== 0 && value !== undefined && value !== null;
          })
        );
        console.log(filteredRecord);
        this.apiService.post<ServiceMaster>('servicenumbers', filteredRecord).subscribe({
    next:(res:ServiceMaster)=>{
      console.log('service master created:', res);
     
    },error:(err)=>{
      console.log(err);
      
    },complete:()=>{
      this.confirmationService.confirm({
        message: `ServiceMaster  Added successfully. Click Yes to go to the Main Page.`,
        header: 'Added Successfully',
        icon: 'pi pi-check',
        accept: () => {
          this.router.navigate(['/servicemaster']);
        },
        reject: () => {
        }
      });
    }
        })
    }
  }
}


