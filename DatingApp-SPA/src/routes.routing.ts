import { AuthGuard } from "./app/guards/auth.guard";
import { MembersComponent } from "./app/members/members.component";
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
      { path: "lists", component: ListsComponent },
      { path: "members", component: MembersComponent }
    ]
  },

  { path: "**", redirectTo: "", pathMatch: "full" }
];

export const MyRoutes = RouterModule.forRoot(routes);
