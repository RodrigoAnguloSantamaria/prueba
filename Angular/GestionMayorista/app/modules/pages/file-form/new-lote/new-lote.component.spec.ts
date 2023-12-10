import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLoteComponent } from './new-lote.component';

describe('NewLoteComponent', () => {
  let component: NewLoteComponent;
  let fixture: ComponentFixture<NewLoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewLoteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewLoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
