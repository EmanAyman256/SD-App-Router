import { Component, OnInit } from '@angular/core';
import {NavigationExtras, Router } from '@angular/router';
import { FormulaService } from '../formula.service';
import { ApiService } from 'src/app/shared/ApiService.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
  providers: [FormulaService, ApiService, MessageService, ConfirmationService]
})
export class TestComponent implements OnInit {

  result: number = 0;
  visible: boolean = false;
  parameterIds: string[] = [];
  parameterDescriptions: string[] = []
  testInformation: any;
  formulaLogic!: string;
  passedCreateInfo: any;
  passedParamInfo: any;
 
  constructor(private router: Router,public formulaService: FormulaService,
    private apiService: ApiService, private messageService: MessageService, private confirmationService: ConfirmationService) {
  }

  ngOnInit() {
    this.testInformation = this.formulaService.getFormulaInformation().testInformation;
    // hold data from previous page:
    this.formulaLogic = history.state.formulaLogic;
    this.passedCreateInfo = history.state.passedCreateInfo;
    this.passedParamInfo = history.state.passedParamInfo;
    this.parameterIds = this.passedParamInfo.map((item: { paramID: any; }) => item.paramID);
    this.parameterDescriptions = this.passedParamInfo.map((item: { paramDescription: any; }) => item.paramDescription);
    // console.log(this.parameterIds);
    // console.log(this.parameterDescriptions);
    // console.log(this.passedCreateInfo);
    // console.log(this.passedParamInfo);
    // console.log(this.formulaLogic);
  }

  getVariables(formulaLogic: string): string[] {
    //to extract variables from the formulaLogic string
    const regex = /[a-zA-Z]+/g;
    const variables = formulaLogic.match(regex);
    return variables ? variables : [];
  }

  prevPage() {
    const navigationExtras: NavigationExtras = {
      state: {
        passedCreateInfo: this.passedCreateInfo,
        passedParamInfo: this.passedParamInfo,
        formulaLogic: this.formulaLogic,
      }
    };
    console.log(navigationExtras);
    this.router.navigate(['/formula/relation'],navigationExtras);
  }
  formulaObject1?: any
  valuesTestParam?: number[]

  showResult() {
    if (this.testInformation.variables) {
      const valuesOnly = Object.values(this.testInformation.variables)
        .filter(value => typeof value === 'number') as number[];

      this.valuesTestParam = valuesOnly
      this.formulaService.formulaInformation.testInformation = this.testInformation;

      this.formulaObject1 = {
        formula: this.passedCreateInfo.formula,
        //formula: localStorage.getItem('formula'),
        description: this.passedCreateInfo.description,
        // description: localStorage.getItem('description'),
        numberOfParameters: this.passedCreateInfo.numberOfParameters,
        // numberOfParameters: localStorage.getItem('numberOfParameters'),
        parameterIds: this.parameterIds,
        parameterDescriptions: this.parameterDescriptions,
        formulaLogic: this.formulaLogic,
        testParameters: valuesOnly
      };
      console.log(this.formulaObject1);
      const formulaLogic = this.formulaObject1.formulaLogic;
      const numberOfParameters = this.formulaObject1.numberOfParameters;
      const parameterIds = this.formulaObject1.parameterIds;
      const testParameters = this.formulaObject1.testParameters;
      // Substitute parameter values in the formula logic string
      let formulaLogicWithValues = formulaLogic;
      for (let i = 0; i < numberOfParameters; i++) {
        const parameterId = parameterIds[i];
        const parameterValue = testParameters[i];
        formulaLogicWithValues = formulaLogicWithValues.replace(new RegExp(parameterId, 'g'), parameterValue);
        console.log(formulaLogicWithValues);
      }
      // Evaluate the formula logic string to get the result
      this.result = eval(formulaLogicWithValues);
      console.log(this.result);
      this.visible = true;     
    }
  }

  saveFormula() {
    const formulaObject1: any = {
      formula: this.passedCreateInfo.formula,
      description: this.passedCreateInfo.description,
      numberOfParameters: this.passedCreateInfo.numberOfParameters,
      parameterIds: this.parameterIds,
      parameterDescriptions: this.parameterDescriptions,
      formulaLogic: this.formulaLogic,
      testParameters: this.valuesTestParam
    };
    console.log(formulaObject1);
    this.apiService.post<any>('formulas', formulaObject1).subscribe(
      (response) => {
        console.log('formula created:', response);
        this.result = response.result
        this.confirmationService.confirm({
          message: 'Formula Created successfully. Click Accept to go to the Formulas Page.',
          header: 'Added Successfully',
          icon: 'pi pi-check',
          accept: () => {
            localStorage.clear();
            this.router.navigate(['/formulas']);
          },
          reject: () => {
          }
        });
      },
      (error: HttpErrorResponse) => {
        console.error('An error occurred:', error);
        console.log(error.status);
        if (error.status === 409) {
          this.messageService.add({ severity: 'error', summary: 'Code Conflict', detail: 'This Formula Code already exists', life: 10000 });
        }
      }
    );
  }
}
