import { Component, OnInit } from '@angular/core';
import {NavigationExtras, Router } from '@angular/router';
import { FormulaService } from '../formula.service';

@Component({
  selector: 'app-relation',
  templateUrl: './relation.component.html',
  styleUrls: ['./relation.component.css'],
  providers: [FormulaService]
})
export class RelationComponent implements OnInit {

  passedCreateInfo: any;
  passedParamInfo: any;
  relationInformation: any;
  submitted: boolean = false;
  parameterIds: string[] = [];
  parameterDescriptions: string[] = []
  operations: string[] = ['+', '-', '*', '/', '%', 'π', '^']

  constructor(private router: Router, public formulaService: FormulaService,) {
  }

  paramClick(param: string) {
    this.relationInformation.formulaLogic += param;
  }

  operationClick(operation: string) {
    this.relationInformation.formulaLogic += operation;
  }

  ngOnInit() {
    // hold data from previous page:
    this.passedCreateInfo = history.state.passedCreateInfo;
    this.passedParamInfo = history.state.passedParamInfo;
    this.parameterIds = this.passedParamInfo.map((item: { paramID: any; }) => item.paramID);
    this.parameterDescriptions = this.passedParamInfo.map((item: { paramDescription: any; }) => item.paramDescription);
    // if user press Back Button 
    if (localStorage.getItem('formulaLogic') !== null) {
      this.relationInformation = this.formulaService.getFormulaInformation().relationInformation;
      this.relationInformation.formulaLogic = localStorage.getItem('formulaLogic');
    }
    else {
      this.relationInformation = this.formulaService.getFormulaInformation().relationInformation;
    }
  }

  nextPage() {
    if (this.relationInformation.formulaLogic) {
      // Replace 'π' with '22/7'
      this.relationInformation.formulaLogic = this.relationInformation.formulaLogic.replace(/π/g, '22/7');
      // Replace '^' with '**'
      this.relationInformation.formulaLogic = this.relationInformation.formulaLogic.replace(/\^/g, '**');
      this.formulaService.formulaInformation.relationInformation = this.relationInformation;
      // save relation info in local storage 
      localStorage.setItem('formulaLogic', String(this.relationInformation.formulaLogic));

      const navigationExtras: NavigationExtras = {
        state: {
          formulaLogic: this.relationInformation.formulaLogic,
          passedCreateInfo: this.passedCreateInfo,
          passedParamInfo: this.passedParamInfo
        }
      };
      this.router.navigate(['/formula/test'], navigationExtras);
      return;
    }
    this.submitted = true;
  }

  prevPage() {
    // const navigationExtras: NavigationExtras = {
    //   state: {
    //     passedParamInfo: this.passedParamInfo
    //   }
    // };
    // console.log(navigationExtras);
    this.router.navigate(['/formula/parameter']);
  }
}
