import { AlertifyService } from "./../../services/AlertifyService.service";
import { Message } from "./../../models/message";
import { AuthService } from "src/app/services/Auth.service";
import { UserService } from "./../../services/user.service";
import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  Renderer2,
  OnDestroy
} from "@angular/core";
import * as signalR from "@aspnet/signalr";
import { environment } from "src/environments/environment";
import { tap, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

@Component({
  selector: "app-message-thread",
  templateUrl: "./messageThread.component.html",
  styleUrls: ["./messageThread.component.css"]
})
export class MessageThreadComponent implements OnInit, OnDestroy {
  @Input() recipientId: number;
  @ViewChild("cardBody") cardBody: ElementRef;
  private unSubscribe = new Subject<void>();
  messages: Message[];
  private stop = false;
  private hubConnection: signalR.HubConnection;
  defaultPhoto = environment.defaultPhoto;
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private alertifyService: AlertifyService,
    private render: Renderer2
  ) {}
  newMessageContent = "";
  private userId = "";

  ngOnInit() {
    this.startConnection();
    this.userId = this.authService.decodedToken.nameid;
    this.userService
      .getMessagesThread(this.authService.decodedToken.nameid, this.recipientId)
      .pipe(
        tap(messages => {
          const userId = +this.authService.decodedToken.nameid;
          for (const message of messages) {
            if (message.recipientId === userId && !message.isRead) {
              this.userService.markMessageAsRead(message.id, userId);
            }
          }
        })
      )
      .pipe(takeUntil(this.unSubscribe))
      .subscribe((result: Message[]) => {
        this.messages = result;
      });
    this.hubConnection.serverTimeoutInMilliseconds = 300000;
    this.hubConnection.onclose(() => {
      if (!this.stop) {
        this.hubConnection.start();
      }
    });
  }

  onSubmit() {
    const newMessage: Partial<Message> = {
      senderId: this.authService.decodedToken.nameid,
      recipientId: this.recipientId,
      content: this.newMessageContent
    };
    this.userService
      .sendMessage(newMessage)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(
        (message: Message) => {
          this.messages.push(message);
          this.hubConnection.invoke("SendChatMessage", message);
          this.newMessageContent = "";
        },
        error => {
          this.alertifyService.error(
            "message was not sent successfully: " + error
          );
        }
      );
  }
  scrollToBottom() {
    this.render.setProperty(
      this.cardBody.nativeElement,
      "scrollTop",
      this.cardBody.nativeElement.scrollHeight
    );
  }
  startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.apiUrl + "chat", {
        accessTokenFactory: () => localStorage.getItem("token")
      })
      .build();
    this.hubConnection
      .start()
      .then(() => {
        this.joinRoom();
        this.hubConnection.on("recieveMessage", (message: Message) => {
          if (message.senderId === this.recipientId) {
            this.messages.push(message);
            this.userService.markMessageAsRead(
              message.id,
              this.authService.decodedToken.nameid
            );
            this.notifySender(message);
          }
        });
        this.hubConnection.on("recieveNotification", (message: Message) => {
          const messageToEditIndex = this.messages.findIndex(
            m => m.id === message.id
          );
          if (messageToEditIndex !== -1) {
            this.messages[messageToEditIndex].isRead = true;
            this.messages[messageToEditIndex].dateRead = message.dateRead;
          }
        });
      })
      .catch(err => console.log("Error while starting connection: " + err));
  }
  ngOnDestroy() {
    this.hubConnection.invoke("LeaveRoom", this.userId).then(() => {
      this.stop = true;
      this.hubConnection.stop();
    });

    this.unSubscribe.next();
    this.unSubscribe.complete();
  }
  joinRoom() {
    this.hubConnection.invoke("JoinRoom", this.userId);
  }
  notifySender(message: Message) {
    this.hubConnection.invoke("NotifySender", message.id, message.senderId);
  }
}
