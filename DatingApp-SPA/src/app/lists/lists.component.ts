import { Bring } from "./../models/userParams";
import { Component, OnInit } from "@angular/core";
import { OrderBy, UserParams } from "../models/userParams";
import { PaginationResult, Pagination } from "../models/pagination";
import { User } from "../models/user";
import { AlertifyService } from "../services/AlertifyService.service";
import { UserService } from "../services/user.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-lists",
  templateUrl: "./lists.component.html",
  styleUrls: ["./lists.component.css"]
})
export class ListsComponent implements OnInit {
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
    this.userParams.bring = Bring.LIKEES;
  }
  resetFilter() {
    this.userParams.gender = this.user.gender === "female" ? "male" : "female";
    this.userParams.maxAge = 99;
    this.userParams.minAge = 18;
    this.userParams.bring = Bring.LIKEES;
    this.loadUsers();
  }
  loadUsers() {
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
}
