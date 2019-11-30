import { AlertifyService } from "./../services/AlertifyService.service";
import { Component, OnInit } from "@angular/core";
import { AuthService } from "../services/Auth.service";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";

@Component({
  selector: "nav-bar",
  templateUrl: "./navigationBar.component.html",
  styleUrls: ["./navigationBar.component.css"]
})
export class NavigationBarComponent implements OnInit {
  defaultPhoto = environment.defaultPhoto;
  model: any = {};
  constructor(
    private router: Router,
    public authService: AuthService,
    private alertifyService: AlertifyService
  ) {}
  /*the ngOnInit if statement is for the case of the user refreshing or closing the tab or browser and coming back*/

  photoUrl: string;

  ngOnInit() {
    this.authService.currentPhotoUrl.subscribe(url => (this.photoUrl = url));
  }
  login() {
    this.authService.login(this.model).subscribe(
      next => {
        this.alertifyService.success("Logged In Successfully");
      },
      error => this.alertifyService.error("Username or Password Is Incorrect"),
      () => {
        this.router.navigate(["/members"]);
      }
    );
  }
  loggedIn() {
    return this.authService.loggedIn();
  }
  logOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("info");
    this.authService.currentUser = null;
    this.authService.decodedToken = null;
    this.alertifyService.message("Good Bye");
    this.router.navigate(["/home"]);
  }
}
