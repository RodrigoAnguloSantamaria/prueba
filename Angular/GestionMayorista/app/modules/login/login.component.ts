import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IUser } from 'src/app/shared/models/interfaces/User.interface';
// import { LoginService } from 'src/app/core/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = new FormGroup({
    id: new FormControl('', Validators.compose([Validators.required])),
    password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(8)]))
  });

  constructor(private formBuilder: FormBuilder, private router: Router) { }
  // constructor(private formBuilder: FormBuilder, private router: Router, private loginService: LoginService) { }

  ngOnInit(): void {
  }

  get id() {
    return this.loginForm.get('id');
  }

  get password() {
    return this.loginForm.get('password');
  }

  handleLogin() {
    this.router.navigate(['/home']);
    // this.loginService.getUserById(this.id?.value)?.subscribe(
    //   (response) => {
    //     if (response) {
    //       console.log(`La respuesta existe: encuentra el usuario con id = ${response.id} al que le corresponde el rol = ${response.rol}`);
    //       this.loginForm.reset();
    //       if (response.rol === "empleado") {
    //         this.router.navigate(['/home/add']);
    //       } else {
    //         this.router.navigate(['/home']);
    //       }
    //     } else {
    //       console.log('Usuario no encontrado')
    //     }
    //   });
  }

}
