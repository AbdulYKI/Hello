import { AlertifyService } from "./../services/AlertifyService.service";
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
    private alertifyService: AlertifyService
  ) {}
  userNameToDisplay: string;
  ngOnInit() {
    if (this.authService.loggedIn())
      this.userNameToDisplay = this.authService.decodedToken.unique_name;
  }
  login() {
    this.authService.login(this.model).subscribe(
      next => {
        this.alertifyService.success("Logged In Successfully");
        this.userNameToDisplay = this.authService.decodedToken.unique_name;
      },
      error => this.alertifyService.error(error.message)
    );
  }
  loggedIn() {
    return this.authService.loggedIn();
  }
  logOut() {
    localStorage.removeItem("token");
    this.alertifyService.message("Good Bye");
  }
}
