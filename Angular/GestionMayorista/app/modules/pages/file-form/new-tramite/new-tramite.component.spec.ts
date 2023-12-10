import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTramiteComponent } from './new-tramite.component';

describe('NewTramiteComponent', () => {
  let component: NewTramiteComponent;
  let fixture: ComponentFixture<NewTramiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewTramiteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewTramiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
