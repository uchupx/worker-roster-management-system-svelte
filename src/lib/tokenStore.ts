import { writable } from 'svelte/store';
import { browser } from '$app/environment';
export const token = writable<string | null>(null);

export function saveToken(tokenValue: string, duration: number) {
  token.set(tokenValue);
  localStorage.setItem('token', tokenValue);
  const expiryTime = Date.now() + duration * 1000;
  localStorage.setItem('tokenExpiry', expiryTime.toString());
}

export function loadToken() {
  const storedToken = localStorage.getItem('token');
  const expiryTime = localStorage.getItem('tokenExpiry');
  if (storedToken && expiryTime && Date.now() < parseInt(expiryTime)) {
    token.set(storedToken);
  } else {
    clearToken();
  }
}

export function clearToken() {
  token.set(null);
  if (browser) {
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiry');
  }

}
