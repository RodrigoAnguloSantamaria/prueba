import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomChartTooltipComponent } from './custom-chart-tooltip.component';

describe('CustomChartTooltipComponent', () => {
  let component: CustomChartTooltipComponent;
  let fixture: ComponentFixture<CustomChartTooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomChartTooltipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomChartTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
