import { catchError } from "rxjs/operators";
import { Observable, of } from "rxjs";
import { AlertifyService } from "../app/services/AlertifyService.service";
import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot } from "@angular/router";
import { User } from "src/app/models/user";
import { UserService } from "src/app/services/user.service";

@Injectable()
export class MembersListResolver implements Resolve<User> {
  constructor(
    private alertifyService: AlertifyService,
    private router: Router,
    private userService: UserService
  ) {}

  resolve(snapShot: ActivatedRouteSnapshot): Observable<User> {
    return this.userService.getUsers().pipe(
      catchError(error => {
        this.alertifyService.error("Problem in retreving data");
        this.router.navigate(["/home"]);
        return of(null);
      })
    );
  }
}
