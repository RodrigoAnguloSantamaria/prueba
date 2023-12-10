import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineChartByDatesComponent } from './line-chart-by-dates.component';

describe('LineChartByDatesComponent', () => {
  let component: LineChartByDatesComponent;
  let fixture: ComponentFixture<LineChartByDatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LineChartByDatesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineChartByDatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
