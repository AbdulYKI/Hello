import { AlertifyServiceService } from "./../services/AlertifyService.service";
import { Component, OnInit } from "@angular/core";
import { AuthService } from "../services/Auth.service";

@Component({
  selector: "nav-bar",
  templateUrl: "./navigationBar.component.html",
  styleUrls: ["./navigationBar.component.css"]
})
export class NavigationBarComponent implements OnInit {
  model: any = {};
  constructor(
    private authService: AuthService,
    private alertifyServiceService: AlertifyServiceService
  ) {}

  ngOnInit() {}
  login() {
    this.authService
      .login(this.model)
      .subscribe(
        next => this.alertifyServiceService.success("Logged In Successfully"),
        error => this.alertifyServiceService.error(error.message)
      );
  }
  loggedIn() {
    const token = localStorage.getItem("token");
    return !!token;
  }
  logOut() {
    localStorage.removeItem("token");
    this.alertifyServiceService.message("Good Bye");
  }
}
