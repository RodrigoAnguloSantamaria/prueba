import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashFormComponent } from './cash-form.component';

describe('CashFormComponent', () => {
  let component: CashFormComponent;
  let fixture: ComponentFixture<CashFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
