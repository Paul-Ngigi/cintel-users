import { Component, Input } from '@angular/core';
import { IUser } from '../../interfaces/user.interface';
import { MatTableModule } from '@angular/material/table';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [MatTableModule, NgIf],
  templateUrl: './users-table.component.html',
  styleUrl: './users-table.component.scss',
})
export class UsersTableComponent {
  @Input() users!: IUser[];

  displayedColumns: string[] = [
    'full_name',
    'email',
    'phone_number',
    'address',
    'website',
  ];
}
