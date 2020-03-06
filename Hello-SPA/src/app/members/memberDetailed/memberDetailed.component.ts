import { AuthService } from "./../../services/Auth.service";
import { AlertifyService } from "./../../services/AlertifyService.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { UserService } from "src/app/services/user.service";
import { ActivatedRoute } from "@angular/router";
import { User } from "src/app/models/user";
import {
  NgxGalleryImage,
  NgxGalleryOptions,
  NgxGalleryAnimation
} from "@kolkov/ngx-gallery";
import { environment } from "src/environments/environment";
import { TabsetComponent } from "ngx-bootstrap/tabs";

@Component({
  selector: "app-member-detailed",
  templateUrl: "./memberDetailed.component.html",
  styleUrls: ["./memberDetailed.component.css"]
})
export class MemberDetailedComponent implements OnInit {
  @ViewChild("staticTabs", { static: true }) staticTabs: TabsetComponent;
  defaultPhoto = environment.defaultPhoto;
  user: User;
  galleryOptions: NgxGalleryOptions[] = [];
  galleryImages: NgxGalleryImage[] = [];
  tabHeader: string;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService,
    private alertifyService: AlertifyService
  ) {}

  ngOnInit() {
    this.route.data.subscribe(userData => (this.user = userData["user"]));
    this.route.queryParams.subscribe(params => {
      const selectedTab = params["tabId"];
      this.staticTabs.tabs[selectedTab > 0 ? selectedTab : 0].active = true;
    });
    this.getPhotos();
    this.galleryOptions = [
      {
        width: "450px",
        height: "450px",
        imagePercent: 100,
        preview: false,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide
      }
    ];
    this.tabHeader = "About" + " " + this.user.knownAs;
  }

  getPhotos(): void {
    // tslint:disable-next-line: forin
    for (const photo of this.user.photos) {
      this.galleryImages.push({
        small: photo.url,
        medium: photo.url,
        big: photo.url,
        description: photo.descritpion
      });
    }
  }
  selectTab(tabId: number): void {
    this.staticTabs.tabs[tabId].active = true;
  }
  likeUser(): void {
    this.userService
      .likeUser(this.authService.decodedToken.nameid, this.user.id)
      .subscribe(
        () => this.alertifyService.success("User Liked Successfully"),
        error => this.alertifyService.error(error)
      );
  }
}
