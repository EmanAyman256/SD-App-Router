import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceTypeComponent } from './service-type.component';

describe('ServiceTypeComponent', () => {
  let component: ServiceTypeComponent;
  let fixture: ComponentFixture<ServiceTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServiceTypeComponent]
    });
    fixture = TestBed.createComponent(ServiceTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
