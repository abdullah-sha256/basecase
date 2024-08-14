import axios, { AxiosResponse } from "axios";
import { IUserDetails, IUserLoginSuccessResponse } from "../models/account";
import { TLoginFormData } from "../components/public/landing-route/LoginModal";
import { IProblem } from "../models/problem";

axios.defaults.baseURL = import.meta.env.VITE_CODENOW_API_URL;

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const getHeaders = (token?: string) => ({
  headers: { Authorization: token ? `Token ${token}` : "" },
});

const requests = {
  get: <T>(url: string, token?: string) =>
    axios.get<T>(url, getHeaders(token)).then(responseBody),
  post: <T, V>(url: string, body: V, token?: string) =>
    axios.post<T>(url, body, getHeaders(token)).then(responseBody),
  put: <T, V>(url: string, body: V, token: string) =>
    axios.put<T>(url, body, getHeaders(token)).then(responseBody),
  del: <T>(url: string, token?: string) =>
    axios.delete<T>(url, getHeaders(token)).then(responseBody),
};

const Account = {
  login: (loginFormData: TLoginFormData): Promise<IUserLoginSuccessResponse> =>
    requests.post<IUserLoginSuccessResponse, TLoginFormData>(
      "/account/login/",
      loginFormData
    ),
  logout: (token?: string): Promise<void> =>
    requests.del<void>("/account/logout/", token),
  details: (token?: string): Promise<IUserDetails> =>
    requests.get<IUserDetails>("/account/", token),
};

const Problem = {
  list: (token?: string): Promise<IProblem[]> =>
    requests.get<IProblem[]>("/problems/?include=lastAttempt", token),
};

const codeNowApi = {
  Account,
  Problem,
};

export default codeNowApi;
