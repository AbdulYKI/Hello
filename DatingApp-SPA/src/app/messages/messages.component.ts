import { AlertifyService } from "./../services/AlertifyService.service";
import { MessageContainer } from "./../models/userParams";
import { UserService } from "src/app/services/user.service";
import { Pagination, PaginationResult } from "./../models/pagination";
import { Component, OnInit } from "@angular/core";
import { Message } from "../models/message";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "../services/Auth.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-messages",
  templateUrl: "./messages.component.html",
  styleUrls: ["./messages.component.css"]
})
export class MessagesComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService,
    private alertifyService: AlertifyService
  ) {}
  defaultPhoto = environment.defaultPhoto;
  messages: Message[];
  pagination: Pagination;
  messagesContainer: MessageContainer = MessageContainer.INBOX;
  ngOnInit() {
    this.route.data.subscribe(res => {
      this.messages = res["messages"].result;
      this.pagination = res["messages"].pagination;
    });
  }
  loadMessages(): void {
    this.userService
      .getMessages(
        this.authService.decodedToken.nameid,
        this.pagination.pageSize,
        this.pagination.currentPage,
        this.messagesContainer
      )
      .subscribe((result: PaginationResult<Message[]>) => {
        this.messages = result.result;
        this.pagination = result.pagination;
      });
  }
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadMessages();
  }
  get MessageContainer() {
    return MessageContainer;
  }
  deleteMessage($event, messageId: number): void {
    $event.stopPropagation();
    this.alertifyService.confirm(
      "This message will be deleted only for you, Are you sure you want to delete this?",
      () =>
        this.userService
          .deleteMessage(messageId, this.authService.decodedToken.nameid)
          .subscribe(
            () => {
              const messageIndex = this.messages.findIndex(
                m => m.id === messageId
              );
              this.messages.splice(messageIndex, 1);

              this.alertifyService.success("Message deleted successfully.");
            },
            error => {
              this.alertifyService.error(error);
            }
          )
    );
  }
}
