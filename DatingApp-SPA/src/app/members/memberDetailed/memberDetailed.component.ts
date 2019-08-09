import { AlertifyService } from "./../../services/AlertifyService.service";
import { Component, OnInit } from "@angular/core";
import { UserService } from "src/app/services/user.service";
import { ActivatedRoute } from "@angular/router";
import { User } from "src/app/models/user";
import {
  NgxGalleryImage,
  NgxGalleryOptions,
  NgxGalleryAnimation
} from "ngx-gallery";

@Component({
  selector: "app-memberDetailed",
  templateUrl: "./memberDetailed.component.html",
  styleUrls: ["./memberDetailed.component.css"]
})
export class MemberDetailedComponent implements OnInit {
  user: User;
  galleryOptions: NgxGalleryOptions[] = [];
  galleryImages: NgxGalleryImage[] = [];
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe(userData => (this.user = userData["user"]));
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
    console.log(this.galleryImages);
    console.log(this.galleryOptions);
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
}
