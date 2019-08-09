import { AlertifyService } from "../../services/AlertifyService.service";
import { UserService } from "../../services/user.service";
import { Component, OnInit } from "@angular/core";
import { User } from "../../models/user";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "members-list",
  templateUrl: "./membersList.component.html",
  styleUrls: ["./membersList.component.css"]
})
export class MembersListComponent implements OnInit {
  constructor(
    private userService: UserService,
    private alertifyService: AlertifyService,
    private route: ActivatedRoute
  ) {}
  users: User[];
  ngOnInit() {
    this.route.data.subscribe(usersData => (this.users = usersData["users"]));
  }
}
