import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvPieChartGroupComponent } from './adv-pie-chart-group.component';

describe('AdvPieChartGroupComponent', () => {
  let component: AdvPieChartGroupComponent;
  let fixture: ComponentFixture<AdvPieChartGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvPieChartGroupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvPieChartGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
