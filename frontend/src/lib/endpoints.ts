const base = import.meta.env.VITE_PUBLIC_API_URL ?? '';

const endpoints = {
  users: {
    index: `${base}/api/users`,
    refresh: `${base}/api/users/refresh`,
    login: `${base}/api/users/login`,
    logout: `${base}/api/users/logout`,
    register: `${base}/api/users/register`,
  },
  files: {
    index: `${base}/api/files`,
    name: `${base}/api/files/name`,
    move: `${base}/api/files/move`,
  },
  folders: {
    index: `${base}/api/folders`,
    name: `${base}/api/folders/name`,
    move: `${base}/api/folders/move`,
  },
  deleted: {
    index: `${base}/api/deleted`,
    restore: `${base}/api/deleted/restore`,
    all: `${base}/api/deleted/all`,
  },
};

export default endpoints;

export function withQueryParams(
  endpoint: string,
  queryParams: Record<string, string>,
): string {
  let url = endpoint;
  Object.entries(queryParams).forEach(([key, value]) => {
    url += `${url.includes('?') ? '&' : '?'}${key}=${value}`;
  });
  return url;
}

export function withPathParams(
  endpoint: string,
  pathParams: Record<string, string>,
  queryParams: Record<string, string>,
): string {
  let match: RegExpExecArray | null;
  let formattedUri = endpoint;
  while ((match = /#(\w+)/g.exec(endpoint)) !== null) {
    const paramKey = match[1];
    if (!(paramKey in pathParams)) {
      throw new Error(`Missing path parameter: ${paramKey}`);
    }
    formattedUri = formattedUri.replace(match[0], pathParams[paramKey]);
  }
  if (queryParams) return withQueryParams(formattedUri, queryParams);
  return formattedUri;
}
