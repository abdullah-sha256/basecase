import axios, { AxiosResponse } from "axios";
import {
  IUserLoginFailureResponse,
  IUserLoginSuccessResponse,
} from "../models/account";
import { TLoginFormData } from "../components/public/landing-route/LoginModal";

axios.defaults.baseURL = import.meta.env.VITE_CODENOW_API_URL;

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const getHeaders = (token?: string) => ({
  headers: { Authorization: token ? `Bearer ${token}` : "" },
});

const requests = {
  get: <T>(url: string, token?: string) =>
    axios.get<T>(url, getHeaders(token)).then(responseBody),
  post: <T, V>(url: string, body: V, token?: string) =>
    axios.post<T>(url, body, getHeaders(token)).then(responseBody),
  put: <T, V>(url: string, body: V, token: string) =>
    axios.put<T>(url, body, getHeaders(token)).then(responseBody),
  del: <T>(url: string, token: string) =>
    axios.delete<T>(url, getHeaders(token)).then(responseBody),
};

const Account = {
  login: (
    loginFormData: TLoginFormData
  ): Promise<IUserLoginSuccessResponse | IUserLoginFailureResponse> =>
    requests.post<IUserLoginSuccessResponse, TLoginFormData>(
      "/account/login/",
      loginFormData
    ),
};

const codeNowApi = {
  Account,
};

export default codeNowApi;
