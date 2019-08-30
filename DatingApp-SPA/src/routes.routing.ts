import { ListsResolver } from "./resolvers/Lists.resolver";
import { PreventUnsavedChangesGuard } from "./app/guards/prevent-unsaved-changes.guard";
import { MemberEditResolver } from "./resolvers/memberEdit.resolver";
import { MemberEditComponent } from "./app/members/memberEdit/memberEdit.component";
import { MemberDetailedResolver } from "./resolvers/memberDetailed.resolver";
import { MembersListResolver } from "./resolvers/membersList.resolver";
import { MemberDetailedComponent } from "./app/members/memberDetailed/memberDetailed.component";
import { AuthGuard } from "./app/guards/auth.guard";
import { MembersListComponent } from "./app/members/membersList/membersList.component";
import { ListsComponent } from "./app/lists/lists.component";
import { MessagesComponent } from "./app/messages/messages.component";
import { HomeComponent } from "./app/home/home.component";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  { path: "", component: HomeComponent },
  {
    path: "",
    runGuardsAndResolvers: "always",
    canActivate: [AuthGuard],
    children: [
      { path: "messages", component: MessagesComponent },
      {
        path: "lists",
        component: ListsComponent,
        resolve: { users: ListsResolver }
      },
      {
        path: "members",
        component: MembersListComponent,
        resolve: { users: MembersListResolver }
      },
      {
        path: "member/edit",
        component: MemberEditComponent,
        resolve: { user: MemberEditResolver },
        canDeactivate: [PreventUnsavedChangesGuard]
      },
      {
        path: "members/:id",
        component: MemberDetailedComponent,
        resolve: { user: MemberDetailedResolver }
      }
    ]
  },

  { path: "**", redirectTo: "", pathMatch: "full" }
];

export const MyRoutes = RouterModule.forRoot(routes);
