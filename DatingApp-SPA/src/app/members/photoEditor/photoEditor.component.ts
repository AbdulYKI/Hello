import { Subject } from "rxjs";
import { AlertifyService } from "./../../services/AlertifyService.service";
import { UserService } from "./../../services/user.service";
import { environment } from "./../../../environments/environment";
import { AuthService } from "./../../services/Auth.service";
import { Photo } from "./../../models/photo";
import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  Output,
  EventEmitter
} from "@angular/core";
import { FileUploader } from "ng2-file-upload";
import { takeUntil } from "rxjs/operators";
@Component({
  selector: "app-photo-editor",
  templateUrl: "./photoEditor.component.html",
  styleUrls: ["./photoEditor.component.css"]
})
export class PhotoEditorComponent implements OnInit, OnDestroy {
  private unSubscribe = new Subject<void>();
  @Input() photos: Photo[];

  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl: string;
  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private alertifyService: AlertifyService
  ) {}

  ngOnInit() {
    this.baseUrl = environment.apiUrl;
    this.initialiseUploader();
  }

  initialiseUploader() {
    this.uploader = new FileUploader({
      url:
        this.baseUrl +
        "user" +
        "/" +
        this.authService.decodedToken.nameid +
        "/" +
        "photo",
      allowedFileType: ["image"],
      authToken: "Bearer " + localStorage.getItem("token"),
      autoUpload: false,
      isHTML5: true,
      maxFileSize: 10 * 1024 * 1024,
      removeAfterUpload: true
    });
    this.uploader.onAfterAddingFile = file => (file.withCredentials = false);

    this.uploader.onSuccessItem = (file, response, status, headers) => {
      if (response) {
        const res: Photo = JSON.parse(response);
        const photo: Photo = {
          id: res.id,
          dateAdded: res.dateAdded,
          descritpion: res.descritpion,
          isMain: res.isMain,
          url: res.url
        };
        this.photos.push(photo);
        if (photo.isMain) {
          this.authService.changeMemeberPhotoUrl(photo.url);
          this.authService.currentUser.photoUrl = photo.url;
          localStorage.setItem(
            "info",
            JSON.stringify(this.authService.currentUser)
          );
        }
      }
    };
  }
  setMainPhoto(photo: Photo): void {
    this.userService
      .setMainPhoto(this.authService.decodedToken.nameid, photo.id)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(
        next => {
          var formerMain: Photo = this.photos.filter(p => p.isMain)[0];
          formerMain.isMain = false;
          photo.isMain = true;
          this.authService.changeMemeberPhotoUrl(photo.url);
          this.authService.currentUser.photoUrl = photo.url;
          localStorage.setItem(
            "info",
            JSON.stringify(this.authService.currentUser)
          );
          this.alertifyService.success("Photo set main successfully");
        },
        error => this.alertifyService.error(error)
      );
  }
  deletePhoto(photoId: number): void {
    this.alertifyService.confirm(
      "Are you sure you want to delete this photo?",
      () =>
        this.userService
          .deletePhoto(this.authService.decodedToken.nameid, photoId)
          .pipe(takeUntil(this.unSubscribe))
          .subscribe(
            next => {
              const photoIndexTodelete = this.photos.findIndex(
                p => p.id === photoId
              );
              this.photos.splice(photoIndexTodelete, 1);
              this.alertifyService.success("Photo deleted Successfully");
            },
            error => this.alertifyService.error(error)
          )
    );
  }
  ngOnDestroy(): void {
    this.unSubscribe.next();
    this.unSubscribe.complete();
  }
}
