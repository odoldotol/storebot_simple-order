export type Router<T extends string> = {
  prefix: string;
  version?: Version;
  routes: Routes<T>;
};

type Routes<T extends string> = Record<T, Route>;

type Route = {
  version?: Version;
  path: string;
  method: HttpMethod;
  // params, query, ...
};

type Version = string;

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD';