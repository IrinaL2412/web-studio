import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../core/auth/auth.service";
import {Router} from "@angular/router";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {LoginResponseType} from "../../../../types/login-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {UserType} from "../../../../types/user.type";
import {HotToastService} from "@ngneat/hot-toast";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  constructor(private fb: FormBuilder, private authService: AuthService, private toastService: HotToastService,
              private router: Router) {
  }

  signupForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.pattern('^(?:[А-ЯЁA-Z][а-яёa-z]*)$')]],
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)]],
    agree: [false, Validators.requiredTrue]
  });

  get name() {
    return this.signupForm.get('name');
  }
  get email() {
    return this.signupForm.get('email');
  }
  get password() {
    return this.signupForm.get('password');
  }
  get agree() {
    return this.signupForm.get('agree');
  }

  signup(): void {
    if (this.signupForm.valid && this.signupForm.value.name && this.signupForm.value.email && this.signupForm.value.password
      && this.signupForm.value.agree) {
      this.authService.signup(this.signupForm.value.name, this.signupForm.value.email, this.signupForm.value.password)
        .subscribe({
          next: (data: DefaultResponseType | LoginResponseType) => {
            let error = null;
            if ((data as DefaultResponseType).error !== undefined) {
              error = (data as DefaultResponseType).message;
            }

            const loginResponse = data as LoginResponseType;
            if (!loginResponse.accessToken || !loginResponse.refreshToken || !loginResponse.userId) {
              error = 'Ошибка регистрации';
            }

            if (error) {
              this.toastService.error(error);
              throw new Error(error);
            }

            this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
            this.authService.userId = loginResponse.userId;
            this.toastService.success('Вы успешно зарегистрировались!');

            this.authService.getUserInfo()
              .subscribe((data: UserType | DefaultResponseType) => {
                if ((data as DefaultResponseType).error !== undefined) {
                  error = (data as DefaultResponseType).message;
                }
                this.authService.userName = (data as UserType).name;
              });
            this.router.navigate(['/']);
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this.toastService.error(errorResponse.error.message);
            } else {
              this.toastService.error('Ошибка регистрации');
            }
          }
        })
    }
  }
}
