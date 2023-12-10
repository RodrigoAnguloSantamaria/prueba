import { AuthService } from 'src/app/core/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { ThemesService } from './core/services/themes.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'No Marca';
  constructor(private themes: ThemesService, private authService: AuthService){}
  ngOnInit(): void {
    this.applyThemeBasedOnGroup();
  }

  private applyThemeBasedOnGroup(): void {
    this.authService.getUserGroups().then(groups => {
      // Asigna clases CSS basadas en los grupos
      if (groups.includes('gCivil')) {
        this.themes.loadTheme('gCivil');
      } else if (groups.includes('pNacional')) {
      this.themes.loadTheme('pNacional');
      }else{
        this.themes.loadTheme('interior');
      }
     
    });
}

}