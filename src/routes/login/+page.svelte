<script>
  import { goto } from "$app/navigation";
  import { PUBLIC_API_KEY } from "$env/static/public";
  import { saveToken } from "$lib/tokenStore.js";

  export async function load() {
    console.log(PUBLIC_API_KEY); // public 📣
  }

  let email = "";
  let password = "";
  let error = "";

  const API_URL = "http://localhost:5000"; // Access the API URL from environment variables

  async function handleLogin(event) {
    event.preventDefault();

    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const { token: receivedToken, duration } = await response.json();
      saveToken(receivedToken, duration); // Save the token to local storage
      await goto("/dashboard");
    } else {
      const errorData = await response.json();
      error = errorData.message || "Login failed. Please try again.";
    }
  }
</script>

<div class="flex items-center justify-center h-screen bg-gray-100">
  <div class="w-full max-w-md bg-white rounded-lg shadow-md p-6">
    <h1 class="text-2xl font-bold text-gray-800 mb-4 text-center">
      Admin Login
    </h1>
    <form on:submit={handleLogin}>
      <!-- Email Input -->
      <div class="mb-4">
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          bind:value={email}
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Enter your email"
        />
      </div>

      <!-- Password Input -->
      <div class="mb-4">
        <label
          for="password"
          class="block text-sm font-medium text-gray-700 mb-1"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          bind:value={password}
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Enter your password"
        />
      </div>

      <!-- Error Message -->
      {#if error}
        <p class="text-red-500 text-sm mb-4">{error}</p>
      {/if}

      <!-- Submit Button -->
      <button
        type="submit"
        class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        Login
      </button>
    </form>
  </div>
</div>
