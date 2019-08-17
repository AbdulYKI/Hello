import { environment } from "./../../environments/environment";
import { Observable, observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { User } from "../models/user";

@Injectable({
  providedIn: "root"
})
export class UserService {
  baseUrl: string = environment.apiUrl + "user/";

  constructor(private http: HttpClient) {}

  getUser(id: number): Observable<User> {
    return this.http.get<User>(this.baseUrl + id);
  }
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }
  updateUser(id: number, user: User): Observable<object> {
    return this.http.put(this.baseUrl + id, user);
  }
  setMainPhoto(userId: number, photoId: number): Observable<any> {
    return this.http.post(
      this.baseUrl + userId + "/photo/" + photoId + "/setMain",
      {}
    );
  }
  deletePhoto(userId: number, photoId: number): Observable<any> {
    return this.http.delete(this.baseUrl + userId + "/photo/" + photoId);
  }
}
