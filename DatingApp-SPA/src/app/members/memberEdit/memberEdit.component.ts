import { AuthService } from "./../../services/Auth.service";
import { ActivatedRoute } from "@angular/router";
import { AlertifyService } from "./../../services/AlertifyService.service";
import {
  Component,
  OnInit,
  ViewChild,
  HostListener,
  OnDestroy
} from "@angular/core";
import { User } from "src/app/models/user";
import { UserService } from "src/app/services/user.service";
import { NgForm } from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
@Component({
  selector: "app-memberEdit",
  templateUrl: "./memberEdit.component.html",
  styleUrls: ["./memberEdit.component.css"]
})
export class MemberEditComponent implements OnInit, OnDestroy {
  user: User;
  destroy: Subject<boolean> = new Subject<boolean>();
  @ViewChild("editForm") editForm: NgForm;
  @HostListener("window:beforeunload", ["$event"])
  onWindowClose($event: any): void {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private alertifyService: AlertifyService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.data.subscribe(data => (this.user = data["user"]));
  }
  updateUser() {
    this.userService
      .updateUser(<number>this.authService.decodedToken.nameid, this.user)
      .pipe(takeUntil(this.destroy))
      .subscribe(
        next => {
          this.alertifyService.success("Updated successfully!");
          this.editForm.reset(this.user);
        },
        error => this.alertifyService.error(error)
      );
  }
  ngOnDestroy() {
    this.destroy.next(true);
    this.destroy.unsubscribe();
  }
}
