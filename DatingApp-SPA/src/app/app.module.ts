import { MessagesResovler } from "./../resolvers/messages.resolver";
import { ListsResolver } from "./../resolvers/Lists.resolver";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { FileUploadModule } from "ng2-file-upload";
import { MemberEditResolver } from "./../resolvers/memberEdit.resolver";
import { JwtModule } from "@auth0/angular-jwt";
import { AlertifyService } from "./services/AlertifyService.service";
import { AuthGuard } from "./guards/auth.guard";
import { AuthService } from "./services/Auth.service";
import { MyRoutes } from "./../routes.routing";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { TabsModule } from "ngx-bootstrap/tabs";
import { NgxGalleryModule } from "ngx-gallery";
import { TimeAgoPipe } from "time-ago-pipe";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { ButtonsModule } from "ngx-bootstrap/buttons";

import { PhotoEditorComponent } from "./members/photoEditor/photoEditor.component";
import { PreventUnsavedChangesGuard } from "./guards/prevent-unsaved-changes.guard";
import { MemberEditComponent } from "./members/memberEdit/memberEdit.component";
import { MembersListResolver } from "./../resolvers/membersList.resolver";
import { MemberDetailedResolver } from "./../resolvers/memberDetailed.resolver";
import { MemberDetailedComponent } from "./members/memberDetailed/memberDetailed.component";
import { MemberCardComponent } from "./members/memberCard/memberCard.component";
import { UserService } from "./services/user.service";
import { AppComponent } from "./app.component";
import { RegisterComponent } from "./register/register.component";
import { HomeComponent } from "./home/home.component";
import { MembersListComponent } from "./members/membersList/membersList.component";
import { MessagesComponent } from "./messages/messages.component";
import { ListsComponent } from "./lists/lists.component";
import { ErrorInterceptorProvider } from "./services/Interceptor.service";
import { NavigationBarComponent } from "./navigationBar/navigationBar.component";
import { TruncatePipe } from "./pipes/truncate.pipe";
import { MessageThreadComponent } from "./members/messageThread/messageThread.component";

export function tokenGetter() {
  return localStorage.getItem("token");
}
@NgModule({
  declarations: [
    AppComponent,
    NavigationBarComponent,
    RegisterComponent,
    HomeComponent,
    MembersListComponent,
    MemberCardComponent,
    MemberDetailedComponent,
    MessagesComponent,
    ListsComponent,
    MemberEditComponent,
    PhotoEditorComponent,
    TruncatePipe,
    TimeAgoPipe,
    MessageThreadComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    MyRoutes,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        blacklistedRoutes: ["localhost:5000/api/auth"],
        whitelistedDomains: ["localhost:5000"]
      }
    }),
    FileUploadModule,
    NgxGalleryModule,
    PaginationModule.forRoot(),
    ButtonsModule.forRoot()
  ],
  providers: [
    AuthService,
    AuthGuard,
    AlertifyService,
    ErrorInterceptorProvider,
    UserService,
    MemberDetailedResolver,
    MembersListResolver,
    MemberEditResolver,
    PreventUnsavedChangesGuard,
    ListsResolver,
    MessagesResovler
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
