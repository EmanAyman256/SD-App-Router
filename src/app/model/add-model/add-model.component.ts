import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModelService } from '../model.service';
import { ModelEntity } from '../model.model';
import { ConfirmationService, Message } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { ApiService } from 'src/app/shared/ApiService.service';

@Component({
  selector: 'app-add-model',
  templateUrl: './add-model.component.html',
  styleUrls: ['./add-model.component.css'],
  providers: [ModelService, MessageService, ConfirmationService]
})
export class AddModelComponent implements OnInit {


  modelForm = new FormGroup({
    modelServSpec: new FormControl(''),
    searchTerm: new FormControl(''),
    description: new FormControl('', [Validators.required]),
    blockingIndicator: new FormControl(false),
    serviceSelection: new FormControl(false),
    currencyCode: new FormControl(0)
  });

  recordsCurrency!: any[];

  constructor(private modelService: ModelService, private apiService: ApiService, private messageService: MessageService, private confirmationService: ConfirmationService, private router: Router,) {
  }

  ngOnInit() {
    this.apiService.get<any[]>('currencies').subscribe(response => {
      this.recordsCurrency = response;
    });
  }

  onSubmit(form: FormGroup) {
    const value = form.value;
    const newRecord = new ModelEntity(value.currencyCode,value.modelServSpec,
      value.blockingIndicator, value.serviceSelection,  value.description, value.searchTerm
      );

    // Remove properties with empty or default values
    const filteredRecord = Object.fromEntries(
      Object.entries(newRecord).filter(([_, value]) => {
        return value !== '' && value !== 0 && value !== undefined && value !== null;
      })
    );
    console.log(filteredRecord);
    this.apiService.post<ModelEntity>('modelspecs', filteredRecord).subscribe({
      next: (res: ModelEntity) => {
        console.log('Model created:', res);

      }, error: (err) => {
        console.log(err);

      }, complete: () => {
        this.confirmationService.confirm({
          message: `Model  Added successfully. Click Yes to go to the Main Page.`,
          header: 'Added Successfully',
          icon: 'pi pi-check',
          accept: () => {
            this.router.navigate(['/model']);
          },
          reject: () => {
          }
        });
      }
    })
  }
}
