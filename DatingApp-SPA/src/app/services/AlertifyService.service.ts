import { Injectable } from "@angular/core";

declare let alertify: any;
@Injectable({
  providedIn: "root"
})
export class AlertifyService {
  constructor() {
    alertify.defaults.theme.ok = "btn btn-outline-primary";
    alertify.defaults.theme.cancel = "btn btn-outline-danger";
  }
  confirm(message: string, okCallBack: () => any) {
    alertify
      .confirm(message, function(e) {
        if (e) okCallBack();
      })
      .set({ title: "Dating App", transition: "zoom" });
  }
  success(message: string) {
    alertify.success(message);
  }
  error(message: string) {
    alertify.error(message);
  }
  warning(message: string) {
    alertify.warning(message);
  }
  message(message: string) {
    alertify.message(message);
  }
}
