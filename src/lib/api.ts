import { clearToken, loadToken, token } from '$lib/tokenStore';
import { browser } from '$app/environment';
import { get } from 'svelte/store';
import { PUBLIC_API_KEY } from '$env/static/public';

export async function apiFetch(endpoint: string, options: RequestInit = {}, method: string = 'GET') {
  const storedToken = get(token);
  const headers = new Headers(options.headers || {});
  
  // Add Content-Type: application/json for POST or PUT requests
  if (method.toUpperCase() === 'POST' || method.toUpperCase() === 'PUT') {
    headers.set('Content-Type', 'application/json');
  }

  if (storedToken) {
    headers.set('Authorization', `Bearer ${storedToken}`);
  }

  const response = await fetch( PUBLIC_API_KEY + endpoint, { 
    ...options, 
    headers,
    method: method.toUpperCase()
  });
  
  if (response.status === 401) {
    clearToken();
  }
  return response;
}
