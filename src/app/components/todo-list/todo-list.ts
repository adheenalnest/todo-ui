import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService, TodoItem } from '../../services/todo';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.css',
})
export class TodoList implements OnInit {
  todos: TodoItem[] = [];
  newTitle = '';
  newDescription = '';
  editingId: number | null = null;
  editTitle = '';
  editDescription = '';
  error = '';
  loading = false;

  page = 1;
  pageSize = 5;
  totalCount = 0;

  get totalPages() {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  get pageNumbers() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get completedCount() {
    return this.todos.filter(t => t.isCompleted).length;
  }

  get progressPercent() {
    return this.todos.length ? Math.round((this.completedCount / this.todos.length) * 100) : 0;
  }

  constructor(private todoService: TodoService, private authService: AuthService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.todoService.getAll(this.page, this.pageSize).subscribe({
      next: (result) => {
        this.todos = result.items ?? [];
        this.totalCount = result.totalCount ?? 0;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'Failed to load todos';
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  goToPage(p: number) {
    if (p < 1 || p > this.totalPages) return;
    this.page = p;
    this.load();
  }

  add() {
    if (!this.newTitle.trim()) return;
    this.todoService.create({ title: this.newTitle, description: this.newDescription, isCompleted: false }).subscribe({
      next: () => {
        this.newTitle = '';
        this.newDescription = '';
        this.page = 1;
        this.load();
      },
      error: () => (this.error = 'Failed to add todo'),
    });
  }

  toggle(todo: TodoItem) {
    this.todoService.update(todo.id, { title: todo.title, description: todo.description, isCompleted: !todo.isCompleted }).subscribe({
      next: (updated) => {
        const i = this.todos.findIndex((t) => t.id === updated.id);
        if (i > -1) this.todos[i] = updated;
        this.cdr.markForCheck();
      },
    });
  }

  startEdit(todo: TodoItem) {
    this.editingId = todo.id;
    this.editTitle = todo.title;
    this.editDescription = todo.description;
  }

  saveEdit(todo: TodoItem) {
    this.todoService.update(todo.id, { title: this.editTitle, description: this.editDescription, isCompleted: todo.isCompleted }).subscribe({
      next: (updated) => {
        const i = this.todos.findIndex((t) => t.id === updated.id);
        if (i > -1) this.todos[i] = updated;
        this.editingId = null;
        this.cdr.markForCheck();
      },
    });
  }

  cancelEdit() {
    this.editingId = null;
  }

  delete(id: number) {
    this.todoService.delete(id).subscribe({
      next: () => {
        const remaining = this.totalCount - 1;
        const maxPage = Math.ceil(remaining / this.pageSize) || 1;
        if (this.page > maxPage) this.page = maxPage;
        this.load();
      },
    });
  }

  logout() {
    this.authService.logout();
  }
}
