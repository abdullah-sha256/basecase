import axios, { AxiosResponse } from "axios";
import { IUserDetails, IUserLoginSuccessResponse } from "../models/account";
import { TLoginFormData } from "../components/common/LoginModal";
import {
  IAttempt,
  IClientConfig,
  ICompleteAttemptPayload,
  IGradeSuggestion,
  IProblem,
  ITodayPlan,
} from "../models/problem";

axios.defaults.baseURL = import.meta.env.VITE_BASECASE_API_URL;

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
  patch: <T, V>(url: string, body: V, token?: string) =>
    axios.patch<T>(url, body, getHeaders(token)).then(responseBody),
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
  createAttempt: (problemId: string, token?: string): Promise<IAttempt> =>
    requests.post<IAttempt, Record<string, never>>(
      "/problems/" + problemId + "/",
      {},
      token
    ),
  detail: (problemId: string, token?: string): Promise<IProblem> =>
    requests.get<IProblem>("/problems/" + problemId + "/", token),
  completeAttempt: (
    attemptId: number,
    payload: ICompleteAttemptPayload,
    token?: string
  ): Promise<IAttempt> =>
    requests.patch<IAttempt, ICompleteAttemptPayload>(
      "/attempts/" + attemptId + "/",
      payload,
      token
    ),
  gradeAttempt: (
    attemptId: number,
    payload: { code: string; notes?: string },
    token?: string
  ): Promise<IGradeSuggestion> =>
    requests.post<IGradeSuggestion, { code: string; notes?: string }>(
      "/attempts/" + attemptId + "/grade/",
      payload,
      token
    ),
  todayPlan: (token?: string): Promise<ITodayPlan> =>
    requests.get<ITodayPlan>("/plan/today/", token),
};

const Config = {
  get: (token?: string): Promise<IClientConfig> =>
    requests.get<IClientConfig>("/config/", token),
};

const basecaseApi = {
  Account,
  Problem,
  Config,
};

export default basecaseApi;
