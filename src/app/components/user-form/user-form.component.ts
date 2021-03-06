import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {  Observable } from 'rxjs';
import { IUser } from '../../api/user/user.interface';


interface IUserFormControl {
  userId: string;
  userName: string;
}

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormComponent implements OnInit, OnChanges {
  @Input() users$: Observable<IUser[]>;
  @Input() selectUser: IUser = {id: '', name: ''};

  @Output() eventAddUser = new EventEmitter();
  @Output() eventEditUser = new EventEmitter();
  @Output() eventSaveUser = new EventEmitter();
  @Output() eventDeleteUser = new EventEmitter();
  @Output() eventDeleteUsers = new EventEmitter();
  @Output() eventGetUser = new EventEmitter();

  userForm: FormGroup;

  constructor() {}


  ngOnInit() {
    this.userForm = new FormGroup({
      baseInfo: new FormGroup({
        userName: new FormControl('', [
          Validators.minLength(2),
          Validators.maxLength(20),
          Validators.required
        ]),
        userId: new FormControl('', [])
      })
    });
    this.subChangeInputName();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectUser) {
      this.userForm.get('baseInfo').setValue({
        userId: changes.selectUser.currentValue.id,
        userName: changes.selectUser.currentValue.name
      });
    }
    if (changes.user$) {
      this.users$ = changes.users$.currentValue;
    }
  }

  addUser(): void {
    const name = this.getUserParams('name');
    if (!name) { return; }
    this.eventAddUser.emit({id: '', name});
  }

  saveUser(): void {
      this.eventSaveUser.emit();
  }

  deleteUser(): void {
    const user = this.selectUser;
    if (!user.id) { return; }
    this.eventDeleteUser.emit(user);
    this.resetUserForm();
  }

  deleteAllUsers(): void {
    this.eventDeleteUsers.emit();
    this.resetUserForm();
  }

  getUser(id: string): void {
    this.eventGetUser.emit({id, name: ''});
  }

  resetUserForm(): void {
    this.userForm.get('baseInfo').reset();
  }

  getUserParams(property: string): string {
    switch (property) {
      case 'id':
        return this.userForm.get('baseInfo').value.userId || '';
      case 'name':
        return this.userForm.get('baseInfo').value.userName || '';
      default:
        return '';
    }
  }

  subChangeInputName(): void {
    this.userForm.get('baseInfo').valueChanges.subscribe((change: IUserFormControl) => {
      if (change.userId) {
        const newUser: IUser = {
          id: this.getUserParams('id'),
          name: change.userName,
        };
        this.eventEditUser.emit(newUser);
      }
    });
  }
}
