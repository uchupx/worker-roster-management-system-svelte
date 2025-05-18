import { apiFetch } from '$lib/api.js';

export const ssr = false;
export async function load({ fetch }) {
  let shift = [];
  await apiFetch("http://localhost:5000/shifts").then(async (response) => {
    return response.json().then((data) => {
      data.forEach((item) => {
        shift.push({
          title: item.user_name,
          start: item.shift_date,
        })
      })
    })
  })

  return {
    shifts: shift,
  };
}
