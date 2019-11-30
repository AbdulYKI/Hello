import { AlertifyService } from "./../services/AlertifyService.service";
import { AuthService } from "./../services/Auth.service";
import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private alertify: AlertifyService,
    private router: Router
  ) {}
  canActivate(): boolean {
    if (this.auth.loggedIn()) {
      return true;
    }
    this.alertify.warning("Please make sure you are logged in.");
    this.router.navigate([""]);
    return false;
  }
}
