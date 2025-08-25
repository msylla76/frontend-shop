export interface User {
  email: string;
  password: string;
  username: string;
  image: string;
}

// export interface Tokens {
//   accessToken: string; 
//   refreshToken: string;
// }
export interface UserResponse {
  user: User & { token: string };
  // user: Tokens;
 
}
