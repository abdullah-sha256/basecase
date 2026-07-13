export interface IUserLoginSuccessResponse {
  token: string;
}

export interface IUserLoginFailureResponse {
  non_field_errors: string[];
}

export interface IUserLogoutFailureResponse {
  detail: string;
}

export interface IUserDetails {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
}
