import {Component, DoCheck, OnInit} from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import {NavigationEnd, Router} from "@angular/router";
import {HotToastService} from "@ngneat/hot-toast";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, DoCheck {
  isLogged: boolean = false;
  userName: string | null = null;
  activeLink: string = '';

  constructor(private authService: AuthService, private toastService: HotToastService, private router: Router) {
    this.isLogged = this.authService.getIsLoggedIn();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.activeLink = this.router.parseUrl(this.router.url).fragment || '';
      }
    });
  }

  ngOnInit(): void {
    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;
    });
  }

  ngDoCheck() {
    this.userName = this.authService.userName;
  }

  logout(): void {
    this.authService.logout()
      .subscribe({
        next: () => {
          this.doLogout();
        },
        error: () => {
          this.doLogout();
        }
      })
  }

  doLogout(): void {
    this.authService.removeTokens();
    this.authService.userId = null;
    this.authService.userName = null;
    this.toastService.success('Вы вышли из системы');
    this.router.navigate(['/']);
  }
}
