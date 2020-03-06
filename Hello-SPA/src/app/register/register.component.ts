import { Router } from "@angular/router";
import { AlertifyService } from "./../services/AlertifyService.service";
import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { AuthService } from "../services/Auth.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { User } from "../models/user";
import { Country } from "../models/Country";
import { AbstractControl } from "@angular/forms";
@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit {
  @Output() cancelEvent: EventEmitter<any> = new EventEmitter();
  model: any = {};

  flagClass = "default-flag";
  constructor(
    private authService: AuthService,
    private alertifyService: AlertifyService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}
  registerForm: FormGroup;
  countries: Country[];
  ngOnInit() {
    this.getCountries();
    this.buildRegistrationForm();
  }
  getCountries() {
    this.authService.getCountries().subscribe(
      (res: Country[]) =>
        (this.countries = res.sort((c1, c2) => {
          if (c1 > c2) {
            return 1;
          }

          if (c1 < c2) {
            return -1;
          }

          return 0;
        })),
      error => {
        this.alertifyService.error(error);
      }
    );
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
        username: [
          "",
          [
            Validators.minLength(5),
            Validators.maxLength(10),
            Validators.required
          ]
        ],
        confirmPassword: [""],
        gender: ["male"],
        countryNumericCode: ["", [Validators.required]],
        dateOfBirth: ["", [Validators.required, this.validateAge]],
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
  validateAge(control: AbstractControl) {
    const today = new Date();
    const birthDate = new Date(control.value);
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 18 ? null : { underAge: true };
  }
  register() {
    if (this.registerForm.valid) {
      const user: User = Object.assign({}, this.registerForm.value);
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
  onChange(numericCode: number) {
    const country = this.countries.find(c => c.numericCode === numericCode);
    this.flagClass = "flag flag-" + country.alpha2Code.toLocaleLowerCase();
  }
  cancel() {
    this.model = {};
    this.cancelEvent.emit();
  }
}
