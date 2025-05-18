<script>
  import Navbar from "../../components/Navbar.svelte";
  import Calendar from "../../components/Calendar.svelte";

  export let data;
  const { shifts } = data;
</script>

<div class="flex h-screen">
  <!-- Sidebar -->
  <Navbar />

  <!-- Main Content -->
  <div class="flex-1 bg-gray-100 p-6">
    <h1 class="text-2xl font-bold mb-4">Welcome to the Admin Dashboard</h1>
    <Calendar {shifts} />
  </div>
</div>
