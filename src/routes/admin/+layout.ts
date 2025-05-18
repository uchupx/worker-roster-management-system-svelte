import { isAdmin, saveRoles } from '$lib/auth.js';
import { goto } from '$app/navigation';

export async function load({ url, fetch }) {
  if (typeof window !== 'undefined') {
    if (!isAdmin()) {
      goto("/dashboard")
    }
  }
}
