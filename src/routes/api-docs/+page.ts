import { apiFetch } from '$lib/api.js';

export const ssr = false;
export async function load({ fetch }) {
  let apiDocs = [];
  const response = await fetch('http://localhost:5000/docs');
  apiDocs = await response.json();

  return {
    apiDocs: apiDocs,
  };
}
