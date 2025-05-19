<script>
    import { apiFetch } from '$lib/api.js';
    import { shiftStatus } from '$lib/enums.js';
  import Navbar from '../../../components/Navbar.svelte';
  import { onMount } from 'svelte';

  let shifts = [];
  let loading = true;
  let error = null;

  async function fetchShifts() {
    try {
      const response = await apiFetch('/me/shifts');
      if (!response.ok) throw new Error('Failed to fetch shifts');
      shifts = await response.json();
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  }

  // async function deleteShift(id) {
  //   if (confirm('Are you sure you want to Reject this shift request?')) {
  //     try {
  //       const response = await (`/me/shifts/${id}`, {
  //         method: 'POST'
  //       });
  //       if (response.ok) {
  //         shifts = shifts.filter(shift => shift.id !== id);
  //       }
  //     } catch (e) {
  //       alert('Failed to delete shift');
  //     }
  //   }
  // }

  onMount(fetchShifts);
</script>

<div class="flex h-screen">
  <Navbar />
  <div class="flex-1 bg-gray-100 p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Shifts Management</h1>
      <a href="/shifts/create" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Create New Shift
      </a>
    </div>

    {#if loading}
      <div class="text-center">Loading...</div>
    {:else if error}
      <div class="text-red-500">{error}</div>
    {:else}
      <div class="bg-white rounded-lg shadow">
        <table class="min-w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            {#each shifts as shift (shift.id)}
              <tr>
                <td class="px-6 py-4">{shift.user_name}</td>
                <td class="px-6 py-4">{new Date(shift.shift_date).toLocaleDateString()}</td>
                <td class="px-6 py-4">
                  <span class="px-2 py-1 rounded-full text-sm {shift.status === shiftStatus.Approved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                    { shiftStatus[shift.status] }
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex space-x-2">

                    {#if shift.status === shiftStatus.Pending}
                    <!-- <button  -->
                    <!--   on:click={() => deleteShift(shift.id)} -->
                    <!--   class="text-red-600 hover:text-red-800"> -->
                    <!--   Delete -->
                    <!-- </button> -->
                    {/if}
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
</div>
