import { PaginationResult } from "./../app/models/pagination";
import { UserParams } from "./../app/models/userParams";
import { catchError } from "rxjs/operators";
import { Observable, of } from "rxjs";
import { AlertifyService } from "../app/services/AlertifyService.service";
import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot } from "@angular/router";
import { User } from "src/app/models/user";
import { UserService } from "src/app/services/user.service";

@Injectable()
export class MembersListResolver implements Resolve<PaginationResult<User[]>> {
  pageSize = 12;
  pageNumber = 1;
  constructor(
    private alertifyService: AlertifyService,
    private router: Router,
    private userService: UserService
  ) {}

  resolve(
    snapShot: ActivatedRouteSnapshot
  ): Observable<PaginationResult<User[]>> {
    return this.userService.getUsers(this.pageSize, this.pageNumber).pipe(
      catchError(error => {
        this.alertifyService.error("Problem in retreving data");
        this.router.navigate(["/home"]);
        return of(null);
      })
    );
  }
}
