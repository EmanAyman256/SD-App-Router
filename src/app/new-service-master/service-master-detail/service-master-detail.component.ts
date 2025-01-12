import { Component } from '@angular/core';
import { ApiService } from 'src/app/shared/ApiService.service';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ServiceMasterService } from '../new-service-master.service';
import { ServiceMaster } from '../new-service-master.model';

@Component({
  selector: 'app-service-master-detail',
  templateUrl: './service-master-detail.component.html',
  styleUrls: ['./service-master-detail.component.css'],
  providers: [ApiService, ServiceMasterService, MessageService, ConfirmationService]
})
export class ServiceMasterDetailComponent {

  selectedRecord: ServiceMaster = {
    serviceNumberCode: 0, searchTerm: '', description: '', serviceText: '', shortTextChangeAllowed: false, deletionIndicator: false,
    numberToBeConverted: 0, convertedNumber: 0, mainItem: false,
    serviceTypeCode: '', materialGroupCode: '',
     baseUnitOfMeasurement: '', toBeConvertedUnitOfMeasurement: '', defaultUnitOfMeasurement: ''
  };

  constructor( private router: Router,) {
    if (this.router.getCurrentNavigation()?.extras.state) {
      const state = this.router.getCurrentNavigation()?.extras.state?.['RecordDetails'];
      if (state) {
        this.selectedRecord = state;
        console.log(this.selectedRecord);
      }
    }
  }
  navigateMainPage(){
    this.router.navigate(['/servicemaster']);
  }
}
