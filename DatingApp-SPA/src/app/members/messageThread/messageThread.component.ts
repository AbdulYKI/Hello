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
  AfterViewInit,
  AfterContentInit
} from "@angular/core";

import { environment } from "src/environments/environment";
import { tap } from "rxjs/operators";

@Component({
  selector: "app-message-thread",
  templateUrl: "./messageThread.component.html",
  styleUrls: ["./messageThread.component.css"]
})
export class MessageThreadComponent implements OnInit {
  @Input() recipientId: number;
  @ViewChild("cardBody") cardBody: ElementRef;
  messages: Message[];
  defaultPhoto = environment.defaultPhoto;
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private alertifyService: AlertifyService,
    private render: Renderer2
  ) {}
  newMessageContent = "";
  ngOnInit() {
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
      .subscribe((result: Message[]) => {
        this.messages = result;
      });
  }

  onSubmit() {
    const newMessage: Partial<Message> = {
      senderId: this.authService.decodedToken.nameid,
      recipientId: this.recipientId,
      content: this.newMessageContent
    };
    this.userService.sendMessage(newMessage).subscribe(
      (message: Message) => {
        this.messages.push(message);
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
}
