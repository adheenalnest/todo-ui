import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { Register } from './components/register/register';
import { TodoList } from './components/todo-list/todo-list';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/todos', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: Register },
  { path: 'todos', component: TodoList, canActivate: [authGuard] },
];
