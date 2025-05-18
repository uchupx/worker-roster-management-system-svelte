import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';
export const roles = writable<string | null>(null);

export function saveRoles(role: any) {
  roles.set(role);
}

export function isAdmin() {
  const data = get(roles);
  if (data === null) {
    return false
  }

  for (const role of data) {
    if (role.id === 1) {
      return true;
    }
  }
}
