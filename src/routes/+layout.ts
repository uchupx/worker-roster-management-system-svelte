import { redirect } from '@sveltejs/kit';
import { token, loadToken } from '$lib/tokenStore';
import { get } from 'svelte/store';
import { apiFetch } from '$lib/api.js';
import { saveRoles } from '$lib/auth.js';
import '@fortawesome/fontawesome-free/css/all.min.css'

export async function load({ url, fetch }) {
  const isLoginPage = url.pathname === '/login';

  if (!isLoginPage) {
    if (typeof window !== 'undefined') {
      loadToken();

      if (get(token) == null) {
        redirect(301, "/login")
      }
      await apiFetch('/me', { method: 'GET' }).then(async (response) => {
        const data = await response.json();
        saveRoles(data.roles);
      })
    }
  }

  return {};
}
