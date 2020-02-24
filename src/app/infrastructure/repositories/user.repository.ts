import { Injectable } from '@angular/core';
import { User } from '../../models/user';
const TABLE_USER = 'users';
@Injectable()
export class UserRepository {
  add(profile: gapi.auth2.BasicProfile) {
    const users = this.getAll();
    let foundIndex = - 1;
    for (let v = 0; v < users.length; v++) {
      if (users[v].Id === profile.getId()) {
        foundIndex = v;
        break;
      }
    }
    if (foundIndex >= 0) {
      users.splice(foundIndex, 1);
    }
    users.push(User.fromBasicProfile(profile));
    this.save(users);
  }
  getAll(): User[] {
    const data = localStorage.getItem(TABLE_USER);
    if (data) {
      return <User[]>(JSON.parse(data));
    } else {
      return [];
    }
  }
  save(users: User[]) {
    localStorage.setItem(TABLE_USER, JSON.stringify(users));
  }
}
