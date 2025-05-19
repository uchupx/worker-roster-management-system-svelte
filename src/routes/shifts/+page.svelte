<script>
  import Navbar from '../../components/Navbar.svelte';
  import Calendar from '../../components/Calendar.svelte';
  import { onMount } from 'svelte';
    import { apiFetch } from '$lib/api.js';

  let shifts = [];

  // Fetch shifts for the current month
  async function fetchShifts(start = null, end = null) {
    shifts = [];
    const url  = new URLSearchParams
    if (start && end) {
      url.append('dateStart', Math.floor(start.getTime() / 1000));
      url.append('dateEnd', Math.floor(end.getTime() / 1000));
    }

    const response = await apiFetch('/shifts/months?' + url.toString(), {});
    await response.json().then((data) => {
      data.forEach((item) => {
        shifts.push({
          title: item.user_name,
          start: item.shift_date,
        })
      })
    })
  }

  function handleMonthChange(start, end) {
    fetchShifts(start, end);
  }

  // Fetch shifts on component mount
  onMount(() => {
    fetchShifts();
  });
</script>

<div class="flex h-screen">
  <!-- Sidebar -->
  <Navbar />

  <!-- Main Content -->
  <div class="flex-1 bg-gray-100 p-6">
    <h1 class="text-2xl font-bold mb-4">Welcome to the Admin Dashboard</h1>
    <Calendar { shifts } on:monthChange="{(e) => handleMonthChange(e.detail.start, e.detail.end)}" />
  </div>
</div>
