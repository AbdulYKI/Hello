import { User } from "./../models/user";
import { environment } from "./../../environments/environment";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { JwtHelperService } from "@auth0/angular-jwt";
import { BehaviorSubject } from "rxjs";
@Injectable({
  providedIn: "root"
})
export class AuthService {
  baseUrl: string = environment.apiUrl + "auth/";
  jwtHelper: JwtHelperService = new JwtHelperService();
  decodedToken: any;
  currentUser: User;
  photoUrl = new BehaviorSubject<string>("../../assets/user.png.png");
  currentPhotoUrl = this.photoUrl.asObservable();
  constructor(private http: HttpClient) {}
  changeMemeberPhotoUrl(photoUrl: string) {
    this.photoUrl.next(photoUrl);
  }
  login(model: User) {
    return this.http.post(this.baseUrl + "login", model).pipe(
      map((user: any) => {
        if (user) {
          localStorage.setItem("info", JSON.stringify(user.info));
          localStorage.setItem("token", user.token);
          this.currentUser = user.info;
          this.changeMemeberPhotoUrl(this.currentUser.photoUrl);
          this.decodedToken = this.jwtHelper.decodeToken(user.token);
        }
      })
    );
  }
  register(model: User) {
    return this.http.post(this.baseUrl + "register", model);
  }
  loggedIn() {
    const token = localStorage.getItem("token");
    return !this.jwtHelper.isTokenExpired(token);
  }
  getCountries() {
    return this.http.get(this.baseUrl + "Countries");
  }
}
