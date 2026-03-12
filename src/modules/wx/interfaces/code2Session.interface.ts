export interface Code2SessionSuccess {
  session_key: string;
  unionid: string;
  openid: string;
}

export interface Code2SessionError {
  errcode: number;
  errmsg: string;
}

export type Code2SessionResponse = Code2SessionSuccess | Code2SessionError;
