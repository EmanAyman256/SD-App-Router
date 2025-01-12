import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewServiceMasterComponent } from './new-service-master.component';

describe('NewServiceMasterComponent', () => {
  let component: NewServiceMasterComponent;
  let fixture: ComponentFixture<NewServiceMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewServiceMasterComponent]
    });
    fixture = TestBed.createComponent(NewServiceMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
