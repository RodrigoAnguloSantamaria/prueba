import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsTableComponent } from './projects-table.component';

describe('ProjectTableComponent', () => {
  let component: ProjectsTableComponent;
  let fixture: ComponentFixture<ProjectsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectsTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
