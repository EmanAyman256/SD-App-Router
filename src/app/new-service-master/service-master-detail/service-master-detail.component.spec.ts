import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceMasterDetailComponent } from './service-master-detail.component';

describe('ServiceMasterDetailComponent', () => {
  let component: ServiceMasterDetailComponent;
  let fixture: ComponentFixture<ServiceMasterDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServiceMasterDetailComponent]
    });
    fixture = TestBed.createComponent(ServiceMasterDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
