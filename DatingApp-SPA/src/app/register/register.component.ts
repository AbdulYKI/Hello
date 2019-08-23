import { Router } from "@angular/router";
import { AlertifyService } from "./../services/AlertifyService.service";
import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { AuthService } from "../services/Auth.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { validateConfig } from "@angular/router/src/config";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { User } from "../models/user";

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
    private alertifyService: AlertifyService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}
  registerForm: FormGroup;

  ngOnInit() {
    this.buildRegistrationForm();
  }
  buildRegistrationForm() {
    this.registerForm = this.formBuilder.group(
      {
        password: [
          "",
          [
            Validators.minLength(5),
            Validators.maxLength(10),
            Validators.required
          ]
        ],
        username: ["", [Validators.required]],
        confirmPassword: [""],
        gender: ["male"],
        city: ["", [Validators.required]],
        country: ["", [Validators.required]],
        dateOfBirth: ["", [Validators.required]],
        knownAs: ["", [Validators.required]]
      },
      { validator: this.validateConfirmPassowrd }
    );
  }
  validateConfirmPassowrd(g: FormGroup) {
    return g.get("password").value === g.get("confirmPassword").value
      ? null
      : { mismatch: true };
  }
  register() {
    if (this.registerForm.valid) {
      var user: User = Object.assign({}, this.registerForm.value);
      this.authService.register(user).subscribe(
        () => {
          this.alertifyService.success("Registered Successfully");
        },
        error => {
          this.alertifyService.error(error);
          return console.log(error);
        },
        () => {
          this.authService.login(user).subscribe(
            () => this.router.navigate(["/members"]),
            error => {
              this.alertifyService.error(error);
            }
          );
        }
      );
    }

    console.log(this.registerForm);
  }
  cancel() {
    this.model = {};
    this.cancelEvent.emit();
  }
}
