
import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FundamentalNgxCoreModule } from '@fundamental-ngx/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { NgHttpLoaderModule } from 'ng-http-loader';


import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { StepsModule } from 'primeng/steps';
import { ChipModule } from 'primeng/chip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PaginatorModule } from 'primeng/paginator';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { AnimateModule } from 'primeng/animate';
import { CardModule } from 'primeng/card';
import { FieldsetModule } from 'primeng/fieldset';
import { TreeTableModule } from 'primeng/treetable';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ModelComponent } from './model/model.component';
import { AddModelComponent } from './model/add-model/add-model.component';
import { ModelDetailsComponent } from './model-details/model-details.component';
import { ServiceTypeComponent } from './service-type/service-type.component';
import { FormulaComponent } from './formula/formula.component';
import { CreateComponent } from './formula/create/create.component';
import { ParameterComponent } from './formula/parameter/parameter.component';
import { RelationComponent } from './formula/relation/relation.component';
import { TestComponent } from './formula/test/test.component';
import { FormulasComponent } from './formulas/formulas.component';
import { AuthModule } from './auth/auth.module';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { AlertComponent } from './shared/alert/alert.component';
import { AddEditServiceMasterComponent } from './new-service-master/add-edit-service-master/add-edit-service-master.component';
import { HomeComponent } from './home/home.component';
import { NewServiceMasterComponent } from './new-service-master/new-service-master.component';
import { ServiceMasterDetailComponent } from './new-service-master/service-master-detail/service-master-detail.component';
import { HasRoleDirective } from './shared/has-role.directive';

@NgModule({
  declarations: [
    HasRoleDirective,

    AppComponent,
    HeaderComponent,
    ModelComponent,
    AddModelComponent,
    ModelDetailsComponent,
    ServiceTypeComponent,
    FormulaComponent,
    CreateComponent,
    ParameterComponent,
    RelationComponent,
    TestComponent,
    FormulasComponent,
    LoadingSpinnerComponent,
    AddEditServiceMasterComponent,
    HomeComponent,
    NewServiceMasterComponent,
    ServiceMasterDetailComponent,
    HasRoleDirective
  ],
  imports: [
    FundamentalNgxCoreModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    AuthModule,

    ButtonModule,
    TableModule,
    DropdownModule,
    DialogModule,
    ToolbarModule,
    InputTextareaModule,
    MessagesModule,
    ToastModule,
    StepsModule,
    AnimateModule,
    CardModule,
    ChipModule,
    ConfirmDialogModule,
    PaginatorModule,
    MultiSelectModule,
    CheckboxModule,
    FieldsetModule,
    TreeTableModule,
  
    NgHttpLoaderModule.forRoot(),
  ],
 // providers: [],
 providers: [
  provideClientHydration(),
  {
    provide:HTTP_INTERCEPTORS,
    useClass:AuthInterceptorService,
    multi:true
  }
],
  bootstrap: [AppComponent]
})
export class AppModule { }
