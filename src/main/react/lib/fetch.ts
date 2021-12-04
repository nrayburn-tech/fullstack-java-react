// Lazy loaded only when needed.
import type { redirect } from '../components/loginRedirect';

let loginRedirect: redirect;

/**
 * Takes the same parameters as fetch, but sets the `Content-Type` to `application/json`.
 * If the response is not ok, throws an error with the request and response info.
 * If the response is re-directed to the login page, shows the loginRedirect notification,
 * and throws an error with the request and response info.
 * If no error, returns the response json.
 */
export async function fetchJSON(input: RequestInfo, init?: RequestInit) {
  const opts = init ? { ...init } : {};
  if (!opts.headers) {
    opts.headers = {};
  }
  // Set the header for JSON.
  if (Array.isArray(opts.headers)) {
    opts.headers.push(['Content-Type', 'application/json']);
    // opts.headers.push(['Accept', 'application/json']);
  } else if (opts.headers instanceof Headers) {
    opts.headers.set('Content-Type', 'application/json');
    // opts.headers.set('Accept', 'application/json');
  } else {
    opts.headers['Content-Type'] = 'application/json';
    // opts.headers['Accept'] = 'application/json';
  }

  const res = await fetch(input, opts);
  if (!res.ok) {
    throw new FetchError({ res, reqInfo: input, reqInit: init });
  }
  if (res.redirected) {
    if (res.url.endsWith('/login')) {
      if (!loginRedirect) {
        loginRedirect = (await import('../components/loginRedirect')).default;
      }
      loginRedirect(res.url);
    }
    throw new RedirectError({ res, reqInfo: input, reqInit: init });
  }

  return await res.json();
}

export class FetchError extends Error {
  readonly res: Response;
  readonly reqInfo: RequestInfo;
  readonly reqInit?: RequestInit;

  constructor({
    res,
    reqInfo,
    reqInit
  }: {
    res: Response;
    reqInfo: RequestInfo;
    reqInit?: RequestInit;
  }) {
    super(`Received error code ${res.status} from the server.`);
    this.res = res;
    this.reqInfo = reqInfo;
    this.reqInit = reqInit;
  }
}

export class RedirectError extends Error {
  readonly res: Response;
  readonly reqInfo: RequestInfo;
  readonly reqInit?: RequestInit;

  constructor({
    res,
    reqInfo,
    reqInit
  }: {
    res: Response;
    reqInfo: RequestInfo;
    reqInit?: RequestInit;
  }) {
    super(`Received a redirect to ${res.url} instead of json data.`);
    this.res = res;
    this.reqInfo = reqInfo;
    this.reqInit = reqInit;
  }
}
