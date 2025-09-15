export type ApiSpec<T extends string> = {
  prefix: string;
  version?: Version;
} & Record<T, Endpoint>;

type Endpoint = {
  version?: Version;
  path: string;
  method: HttpMethod;
  // params, query, ...
};

type Version = `${number}`;

type HttpMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'PATCH'
  | 'OPTIONS'
  | 'HEAD'
  | 'CONNECT'
  | 'TRACE';
