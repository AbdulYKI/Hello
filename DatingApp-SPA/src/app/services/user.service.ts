import { UserParams } from "./../models/userParams";
import { PaginationResult } from "./../models/pagination";
import { environment } from "./../../environments/environment";
import { Observable, observable } from "rxjs";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { User } from "../models/user";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class UserService {
  baseUrl: string = environment.apiUrl + "user/";

  constructor(private http: HttpClient) {}

  getUser(id: number): Observable<User> {
    return this.http.get<User>(this.baseUrl + id);
  }
  getUsers(
    pageSize?: number,
    pageNumber?: number,
    userParams?: UserParams
  ): Observable<PaginationResult<User[]>> {
    const paginationResult = new PaginationResult<User[]>();
    let params = new HttpParams();
    if (pageSize != null && pageNumber != null) {
      params = params.append("pageSize", pageSize.toString());
      params = params.append("pageNumber", pageNumber.toString());
    }
    if (userParams != null) {
      if (userParams.maxAge != null) {
        params = params.append("maxAge", userParams.maxAge.toString());
      }
      if (userParams.minAge != null) {
        params = params.append("minAge", userParams.minAge.toString());
      }
      if (userParams.gender != null) {
        params = params.append("gender", userParams.gender);
      }

      if (userParams.orderBy != null) {
        params = params.append("orderBy", userParams.orderBy.toString());
      }

      if (userParams.bring != null) {
        params = params.append("bring", userParams.bring.toString());
      }
    }

    return this.http
      .get<User[]>(this.baseUrl, { observe: "response", params: params })
      .pipe(
        map(Response => {
          paginationResult.result = Response.body;
          if (Response.headers.get("Pagination") != null) {
            paginationResult.pagination = JSON.parse(
              Response.headers.get("Pagination")
            );
          }
          return paginationResult;
        })
      );
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
  likeUser(userId: number, recipientId: number): Observable<any> {
    return this.http.post(
      this.baseUrl + userId + "/" + "likes" + "/" + recipientId,
      {}
    );
  }
}
