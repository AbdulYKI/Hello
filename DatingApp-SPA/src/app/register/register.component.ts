import { AlertifyService } from "./../services/AlertifyService.service";
import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { AuthService } from "../services/Auth.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit {
  @Output() cancelEvent: EventEmitter<any> = new EventEmitter();
  model: any = {};
  constructor(
    private authService: AuthService,
    private alertifyService: AlertifyService
  ) {}

  ngOnInit() {}
  register() {
    this.authService.register(this.model).subscribe(
      () => {
        this.alertifyService.success("Registered Successfully");
      },
      error => {
        this.alertifyService.error(error);
        return console.log(error);
      }
    );
  }
  cancel() {
    this.model = {};
    this.cancelEvent.emit();
  }
}
