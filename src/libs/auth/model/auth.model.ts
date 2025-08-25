import { User } from '@libs/core/models/user';

type UserState = User & { token: string };
// type UserState = Tokens;

export type AuthState = {
  loggedIn: boolean;
  user: UserState;
};

export const initialUserValue: UserState = {
  email: '',
  username: '',
  password: '',
  image: '',
  token: '',
};

// export const initialUserValue: UserState = {
//   accessToken: '',
//   refreshToken: '',
// };

export const authInitialState: AuthState = {
  loggedIn: false,
  user: initialUserValue,
};
