import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const API = 'http://localhost:5177/api';

export interface TodoItem {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  createdAt: string;
}

export interface TodoDto {
  title: string;
  description: string;
  isCompleted: boolean;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
}

@Injectable({ providedIn: 'root' })
export class TodoService {
  constructor(private http: HttpClient) {}

  getAll(page: number, pageSize: number) {
    return this.http.get<PagedResult<TodoItem>>(`${API}/todo?page=${page}&pageSize=${pageSize}`);
  }

  create(dto: TodoDto) {
    return this.http.post<TodoItem>(`${API}/todo`, dto);
  }

  update(id: number, dto: TodoDto) {
    return this.http.put<TodoItem>(`${API}/todo/${id}`, dto);
  }

  delete(id: number) {
    return this.http.delete(`${API}/todo/${id}`);
  }
}
