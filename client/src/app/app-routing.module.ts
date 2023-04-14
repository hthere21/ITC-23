import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { UserPageComponent } from './user-page/user-page.component';
import { UpdateInfoComponent } from './update-info/update-info.component';
import { SavedListComponent } from './saved-list/saved-list.component';
import { ChatComponent } from './chat/chat.component';
import { AuthGuard } from './auth.guard';
import { AboutUsComponent } from './about-us/about-us.component';
import { FaqComponent } from './faq/faq.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'user', component: UserPageComponent, canActivate: [AuthGuard] },
  { path: 'update', component: UpdateInfoComponent, canActivate: [AuthGuard] },
  { path: 'save', component: SavedListComponent, canActivate: [AuthGuard] },
  { path: 'chat/:userInfo.name/:userId.name/:userInfo._id/:userId._id', component: ChatComponent, canActivate: [AuthGuard]},
  { path: 'about', component: AboutUsComponent },
  { path: 'faq', component: FaqComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
