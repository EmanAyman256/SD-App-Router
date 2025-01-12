import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditServiceMasterComponent } from './add-edit-service-master.component';

describe('AddEditServiceMasterComponent', () => {
  let component: AddEditServiceMasterComponent;
  let fixture: ComponentFixture<AddEditServiceMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditServiceMasterComponent]
    });
    fixture = TestBed.createComponent(AddEditServiceMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
