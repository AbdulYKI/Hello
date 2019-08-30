import { AlertifyService } from "./../../services/AlertifyService.service";
import { UserService } from "src/app/services/user.service";
import { environment } from "./../../../environments/environment";

import { Component, OnInit, Input } from "@angular/core";
import { User } from "src/app/models/user";
import { AuthService } from "src/app/services/Auth.service";

@Component({
  selector: "app-member-card",
  templateUrl: "./memberCard.component.html",
  styleUrls: ["./memberCard.component.css"]
})
export class MemberCardComponent implements OnInit {
  @Input() user: User;
  defaultPhoto = environment.defaultPhoto;
  @Input() showLikeButton = true;
  constructor(
    private userService: UserService,
    private alertifyService: AlertifyService,
    private authService: AuthService
  ) {}

  ngOnInit() {}
  likeUser(userId: number): void {
    this.userService
      .likeUser(this.authService.decodedToken.nameid, userId)
      .subscribe(
        () => this.alertifyService.success("User Liked Successfully"),
        error => this.alertifyService.error(error)
      );
  }
}
