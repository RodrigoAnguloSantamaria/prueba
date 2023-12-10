import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsChartsComponent } from './projects-charts.component';

describe('ProjectsChartsComponent', () => {
  let component: ProjectsChartsComponent;
  let fixture: ComponentFixture<ProjectsChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectsChartsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectsChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
