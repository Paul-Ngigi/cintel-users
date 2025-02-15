import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { IUser } from '../../interfaces/user.interface';
import { UsersService } from '../../services/users/users.service';
import { UsersTableComponent } from '../users-table/users-table.component';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [UsersTableComponent, MatInputModule, FormsModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
})
export class UsersListComponent implements OnInit {
  private userService: UsersService = inject(UsersService);

  searchTerm: string = ''; // Stores the search input value
  isLoading: boolean = false;

  users: IUser[] = []; // Original users list
  filteredUsers: IUser[] = []; // Users displayed in table

  private searchSubject = new Subject<string>();

  ngOnInit() {
    this.fetchUsers();

    // Debounce user input for better performance
    this.searchSubject.pipe(debounceTime(300)).subscribe(searchTerm => {
      this.filterUsers(searchTerm);
    });
  }

  fetchUsers(): void {
    this.isLoading = true;

    this.userService.getUsers().subscribe({
      next: (res) => {
        this.users = res;
        this.filteredUsers = res; // Initially, filteredUsers = all users
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error fetching users:', error);
      },
    });
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchTerm);
  }

  filterUsers(searchTerm: string): void {
    if (!searchTerm) {
      this.filteredUsers = [...this.users]; // Reset to all users when search is empty
      return;
    }

    const lowerCaseSearch = searchTerm.toLowerCase();

    this.filteredUsers = this.users.filter(user =>
      user.name.toLowerCase().includes(lowerCaseSearch) ||
      user.username.toLowerCase().includes(lowerCaseSearch) ||
      user.email.toLowerCase().includes(lowerCaseSearch)
    );
  }
}
