import { OrderBy } from "./../../models/userParams";
import { Pagination, PaginationResult } from "./../../models/pagination";
import { AlertifyService } from "../../services/AlertifyService.service";
import { UserService } from "../../services/user.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { User } from "../../models/user";
import { ActivatedRoute } from "@angular/router";
import { UserParams } from "src/app/models/userParams";

@Component({
  selector: "app-members-list",
  templateUrl: "./membersList.component.html",
  styleUrls: ["./membersList.component.css"]
})
export class MembersListComponent implements OnInit {
  constructor(
    private userService: UserService,
    private alertifyService: AlertifyService,
    private route: ActivatedRoute
  ) {}

  userParams: UserParams = new UserParams();
  user: User = JSON.parse(localStorage.getItem("info"));
  pagination: Pagination;
  users: User[];
  ngOnInit() {
    this.route.data.subscribe(usersData => {
      this.users = usersData["users"].result;
      this.pagination = usersData["users"].pagination;
    });
    this.userParams.gender = this.user.gender === "female" ? "male" : "female";
    this.userParams.maxAge = 99;
    this.userParams.minAge = 18;
    this.userParams.orderBy = OrderBy.CREATED;
  }
  resetFilter(): void {
    this.userParams.gender = this.user.gender === "female" ? "male" : "female";
    this.userParams.maxAge = 99;
    this.userParams.minAge = 18;
    this.userParams.orderBy = OrderBy.CREATED;
    this.loadUsers();
  }
  loadUsers(): void {
    this.userService
      .getUsers(
        this.pagination.pageSize,
        this.pagination.currentPage,
        this.userParams
      )
      .subscribe((res: PaginationResult<User[]>) => {
        this.users = res.result;
        this.pagination = res.pagination;
      });
  }
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }
  onAgeChanged(event: any): void {
    if (event.target.value < 18 && event.target.name === "maxAge") {
      this.userParams.maxAge = 18;
    }
    if (event.target.value < 18 && event.target.name === "minAge") {
      this.userParams.minAge = 18;
    }
    if (event.target.value > 99 && event.target.name === "maxAge") {
      this.userParams.maxAge = 99;
    }
    if (event.target.value > 99 && event.target.name === "minAge") {
      this.userParams.minAge = 99;
    }
  }
  get OrderBy() {
    return OrderBy;
  }
}
