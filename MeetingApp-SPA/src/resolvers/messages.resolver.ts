import { AuthService } from "./../app/services/Auth.service";
import { PaginationResult } from "./../app/models/pagination";
import { UserParams } from "../app/models/userParams";
import { catchError } from "rxjs/operators";
import { Observable, of } from "rxjs";
import { AlertifyService } from "../app/services/AlertifyService.service";
import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot } from "@angular/router";
import { User } from "src/app/models/user";
import { UserService } from "src/app/services/user.service";
import { Message } from "src/app/models/message";

@Injectable()
export class MessagesResovler implements Resolve<PaginationResult<Message[]>> {
  pageSize = 12;
  pageNumber = 1;

  constructor(
    private alertifyService: AlertifyService,
    private router: Router,
    private userService: UserService,
    private authService: AuthService
  ) {}

  resolve(
    snapShot: ActivatedRouteSnapshot
  ): Observable<PaginationResult<Message[]>> {
    return this.userService
      .getMessages(
        this.authService.decodedToken.nameid,
        this.pageSize,
        this.pageNumber
      )
      .pipe(
        catchError(error => {
          this.alertifyService.error("Problem in retreving messages");
          this.router.navigate(["/home"]);
          return of(null);
        })
      );
  }
}
