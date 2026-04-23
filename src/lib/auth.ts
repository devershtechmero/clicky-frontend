const TOKEN_KEY = "sitewatch.token";
const USER_KEY = "sitewatch.user";

export type AuthUser = {
  id: string;
  email: string;
  role: string;
};

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function getAuthUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function setAuthUser(user: AuthUser): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuthUser(): void {
  localStorage.removeItem(USER_KEY);
}

export function clearAuth(): void {
  clearAuthToken();
  clearAuthUser();
}

export function isAuthenticated(): boolean {
  return Boolean(getAuthToken());
}
