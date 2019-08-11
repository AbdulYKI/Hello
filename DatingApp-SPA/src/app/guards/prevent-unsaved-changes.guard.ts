import { MemberEditComponent } from "../members/memberEdit/memberEdit.component";
import { AlertifyService } from "../services/AlertifyService.service";
import { AuthService } from "../services/Auth.service";
import { Injectable } from "@angular/core";
import { CanDeactivate } from "@angular/router";

@Injectable()
export class PreventUnsavedChangesGuard
  implements CanDeactivate<MemberEditComponent> {
  canDeactivate(component: MemberEditComponent): boolean {
    if (component.editForm.dirty) {
      return confirm(
        "Any unsaved changes won't be commited,are you sure you want to continue?"
      );
    }
    return true;
  }
}
