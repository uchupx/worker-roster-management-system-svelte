<script>
  import { goto } from "$app/navigation";
  import { page } from '$app/stores';
  import { apiFetch } from "$lib/api.js";
  import Navbar from "../../../../components/Navbar.svelte";
  import { DatePicker } from "date-picker-svelte";

  import { onMount } from "svelte";

  let shiftDate = new Date();
  let startTime = "";
  let endTime = "";
  let selectedUserId = "";
  let users = [];

  // Set minimum date to today (start of day)
  const minDate = new Date();
  minDate.setHours(0, 0, 0, 0);

  onMount(async () => {
    try {
      const response = await apiFetch("http://localhost:5000/users", {}, "GET");
      if (response.ok) {
        users = await response.json();
      } else {
        throw new Error("Failed to fetch users");
      }


      const referenceId = $page.url.searchParams.get('reference');
      const data = await apiFetch(`http://localhost:5000/shifts?id=${referenceId}`, {}, "GET");
      if (data.ok) {
        const shift = await data.json();
        if (shift.length > 0) {
          const { start_time, end_time } = shift[0];
          startTime = start_time;
          endTime = end_time;
          selectedUserId = shift[0].user_id;
        }
      } else {
        throw new Error("Failed to fetch shifts");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Failed to load users");
    }
  });

  function handleDateSelect(event) {
    shiftDate = event.detail;
  }

  function formatDate(date) {
    return date.toISOString();
  }

  function validateTimeFormat(time) {
    // Check if time matches HH:mm format and is within valid range
    const [hours, minutes] = time.split(":").map(Number);
    return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    // Validate time formats before submission
    if (!validateTimeFormat(startTime) || !validateTimeFormat(endTime)) {
      alert("Please enter valid times in 24-hour format (00:00 - 23:59)");
      return;
    }

    try {
      const response = await apiFetch(
        "http://localhost:5000/shifts",
        {
          body: JSON.stringify({
            shift_date: formatDate(shiftDate),
            start_time: startTime,
            end_time: endTime,
            user_id: selectedUserId,
          }),
        },
        "POST",
      );

      if (response.ok) {
        alert("Shift created successfully");
        // Reset form
        shiftDate = new Date();
        startTime = "";
        endTime = "";

        goto("/admin/shifts/list");
      } else {
        throw new Error("Failed to create shift");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to create shift");
    }
  }
</script>

<div class="flex h-screen">
  <!-- Sidebar -->
  <Navbar />

  <!-- Main Content -->
  <div class="flex-1 bg-gray-100 p-6">
    <h1 class="text-2xl font-bold mb-4">Create New Shift</h1>

    <form on:submit={handleSubmit} class="max-w-md space-y-4">
      <div>
        <label for="user" class="block text-sm font-medium text-gray-700"
          >Select User</label
        >
        <select
          id="user"
          bind:value={selectedUserId}
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Select a user</option>
          {#each users as user}
            <option value={user.id}>{user.name}</option>
          {/each}
        </select>
      </div>
      <div>
        <label for="shift_date" class="block text-sm font-medium text-gray-700"
          >Shift Date</label
        >
        <div class="mt-1">
          <DatePicker
            value={shiftDate}
            min={minDate}
            max={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
            theme={{
              calendar: "rounded-md shadow-md bg-white p-4",
              input:
                "w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500",
              daySelected: "bg-indigo-600 text-white",
              dayHover: "hover:bg-indigo-100",
              dark: false,
            }}
            on:select={handleDateSelect}
          />
        </div>
      </div>

      <div>
        <label for="start_time" class="block text-sm font-medium text-gray-700"
          >Start Time (24-hour format)</label
        >
        <input
          type="time"
          id="start_time"
          bind:value={startTime}
          required
          pattern="[0-2][0-9]:[0-5][0-9]"
          step="60"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label for="end_time" class="block text-sm font-medium text-gray-700"
          >End Time (24-hour format)</label
        >
        <input
          type="time"
          id="end_time"
          bind:value={endTime}
          required
          pattern="[0-2][0-9]:[0-5][0-9]"
          step="60"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <button
        type="submit"
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Create Shift
      </button>
    </form>
  </div>
</div>
