export interface IUser {
  id: string;
  email: string;
}
export interface IValidatedUser extends IUser {
  roles: string[];
  clientName: string;
}
