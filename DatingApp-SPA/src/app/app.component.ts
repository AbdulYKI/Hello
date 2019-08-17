import { AuthService } from "./services/Auth.service";
import { Component, OnInit } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  title = "DatingApp-SPA";
  jwtHelper: JwtHelperService = new JwtHelperService();
  constructor(private authService: AuthService) {}
  ngOnInit() {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("info"));
    if (token) {
      this.authService.decodedToken = this.jwtHelper.decodeToken(token);
    }
    if (user) {
      this.authService.currentUser = user;
      this.authService.changeMemeberPhotoUrl(
        this.authService.currentUser.photoUrl
      );
    }
  }
}
