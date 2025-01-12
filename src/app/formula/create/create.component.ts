import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { FormulaService } from '../formula.service';
import { ApiService } from 'src/app/shared/ApiService.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  providers: [FormulaService]
})
export class CreateComponent implements OnInit {

  createInformation = { 
    formula: '',
    description: '',
    numberOfParameters: 0,
  }
  submitted: boolean = false;
  isNumberOfParametersValid = true;

  validateNumberOfParameters() {
    this.isNumberOfParametersValid = this.createInformation.numberOfParameters > 0;
  }

  constructor(private route: ActivatedRoute, private apiService: ApiService, private router: Router, public formulaService: FormulaService,) {
  }

  ngOnInit() {
    this.createInformation = this.formulaService.getFormulaInformation().createInformation;
    console.log(this.createInformation);
    // To handle data retrieved from Back Button 
    if (localStorage.getItem('formula') !== null) {
      this.createInformation.formula = localStorage.getItem('formula') ? localStorage.getItem('formula')! : '';
    }
    if (localStorage.getItem('description') !== null) {
      this.createInformation.description = localStorage.getItem('description') ? localStorage.getItem('description')! : '';
    }
    if (localStorage.getItem('numberOfParameters') !== null) {
      this.createInformation.numberOfParameters = Number(localStorage.getItem('numberOfParameters'))
    }
  }

  nextPage() {
    if (this.createInformation.formula && this.createInformation.description && this.createInformation.numberOfParameters
    ) {
      this.formulaService.formulaInformation.createInformation = this.createInformation;
      // Save createInformation in local storage for Back Button 
      localStorage.setItem('formula', this.createInformation.formula);
      localStorage.setItem('description', this.createInformation.description);
      localStorage.setItem('numberOfParameters', String(this.createInformation.numberOfParameters));

      const navigationExtras: NavigationExtras = {
        state: {
          passedCreateInfo: this.createInformation,
          numberOfParameters: this.createInformation.numberOfParameters,
          formula: this.createInformation.formula,
          description: this.createInformation.description
        }
      };
      console.log(navigationExtras);
      this.router.navigate(['/formula/parameter'], navigationExtras);
    }
    this.submitted = true;
  }
}
