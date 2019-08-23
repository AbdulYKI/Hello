import { environment } from "./../../../environments/environment";

import { Component, OnInit, Input } from "@angular/core";
import { User } from "src/app/models/user";

@Component({
  selector: "app-member-card",
  templateUrl: "./memberCard.component.html",
  styleUrls: ["./memberCard.component.css"]
})
export class MemberCardComponent implements OnInit {
  @Input() user: User;
  defaultPhoto = environment.defaultPhoto;
  constructor() {}

  ngOnInit() {}
}
