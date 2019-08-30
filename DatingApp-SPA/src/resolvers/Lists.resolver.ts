import { Bring } from "./../app/models/userParams";
import { UserParams } from "src/app/models/userParams";

import { catchError } from "rxjs/operators";
import { Observable, of } from "rxjs";
import { AlertifyService } from "../app/services/AlertifyService.service";
import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot } from "@angular/router";
import { User } from "src/app/models/user";
import { UserService } from "src/app/services/user.service";

@Injectable()
export class ListsResolver implements Resolve<User> {
  pageSize = 12;
  pageNumber = 1;
  userParams = new UserParams();
  user: User = JSON.parse(localStorage.getItem("info"));
  constructor(
    private alertifyService: AlertifyService,
    private router: Router,
    private userService: UserService
  ) {
    this.userParams.bring = Bring.LIKEES;
  }

  resolve(snapShot: ActivatedRouteSnapshot): Observable<User> {
    return this.userService
      .getUsers(this.pageSize, this.pageNumber, this.userParams)
      .pipe(
        catchError(error => {
          this.alertifyService.error("Problem in retreving data");
          this.router.navigate(["/home"]);
          return of(null);
        })
      );
  }
}
