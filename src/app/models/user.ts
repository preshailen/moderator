export class User {
  static fromBasicProfile(profile: gapi.auth2.BasicProfile): User {
    const user: User = new User();
    user.Id = profile.getId();
    user.Email = profile.getEmail();
    return user;
  }
  Id: string;
  Email: string;
}
