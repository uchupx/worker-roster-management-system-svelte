<script lang="ts">
    import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { isAdmin } from "$lib/auth.js";
    import { clearToken } from "$lib/tokenStore.js";
  import { derived, get } from "svelte/store";

  interface SubLink {
    name: string;
    href: string;
  }

  interface NavLink {
    name: string;
    href: string;
    icon?: string;
    subLinks?: SubLink[];
  }

  export let links: NavLink[] = [
    {
      name: "Home",
      href: "/dashboard",
      icon: "home",
    },
    {
      name: "Shifts",
      href: "/shifts",
      icon: "calendar",
      subLinks: [
        { name: "Calendar", href: "/shifts" },
        { name: "List Shift", href: "/shifts/list" },
      ],
    },
    {
      name: "Api Document",
      href: "/api-docs",
      icon: "settings",
    },
  ];

  if (isAdmin()) {
    links.push({
      name: "Admin Shifts",
      href: "/admin/shifts",
      icon: "calendar",
      subLinks: [
      { name: "List Approval Shift", href: "/admin/shifts/list" }
      ],
    });
  }

  const currentPath = derived(page, ($page) => $page.url.pathname);
  let expandedItems = new Set();

  function toggleSubmenu(index: number) {
    if (expandedItems.has(index)) {
      expandedItems.delete(index);
    } else {
      expandedItems.add(index);
    }
    expandedItems = expandedItems; // Trigger reactivity
  }

  function isActive(href: string) {
    return get(currentPath) === href;
  }

  async function handleLogout() {
    clearToken()
    goto('/login')
  }
</script>

<nav class="w-64 bg-gray-800 text-white flex flex-col min-h-screen">
  <div
    class="p-4 text-lg font-bold border-b border-gray-700 flex items-center gap-2"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
    Admin CMS
  </div>

  <ul class="flex-1 py-2">
    {#each links as link, index}
      <li class="relative">
        {#if link.subLinks}
          <!-- Menu item with submenu -->
          <button
            class="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-700 transition-colors
            {isActive(link.href) ? 'bg-gray-700' : ''}"
            on:click={() => toggleSubmenu(index)}
          >
            <div class="flex items-center gap-3">
              {#if link.icon}
                <span class="text-gray-400">
                  <i class="fas fa-{link.icon}"></i>
                </span>
              {/if}
              <span>{link.name}</span>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 transform transition-transform duration-200 {expandedItems.has(
                index,
              )
                ? 'rotate-180'
                : ''}"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {#if expandedItems.has(index)}
            <ul class="bg-gray-900 py-2">
              {#each link.subLinks as subLink}
                <li>
                  <a
                    href={subLink.href}
                    class="block pl-12 pr-4 py-2 text-sm hover:bg-gray-700 transition-colors
                    {isActive(subLink.href)
                      ? 'bg-gray-700 border-l-4 border-blue-500'
                      : ''}"
                  >
                    {subLink.name}
                  </a>
                </li>
              {/each}
            </ul>
          {/if}
        {:else}
          <!-- Regular menu item -->
          <a
            href={link.href}
            class="flex items-center gap-3 px-4 py-2 hover:bg-gray-700 transition-colors
            {isActive(link.href) ? 'bg-gray-700' : ''}"
          >
            {#if link.icon}
              <span class="text-gray-400">
                <i class="fas fa-{link.icon}"></i>
              </span>
            {/if}
            <span>{link.name}</span>
          </a>
        {/if}
      </li>
    {/each}
  </ul>

  <!-- Optional: User profile section at bottom -->
<div class="border-t border-gray-700 p-4">
  <div class="flex items-center gap-3">
    <div class="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
      <span class="text-sm">JD</span>
    </div>
    <div class="flex-1">
      <div class="text-sm font-medium">John Doe</div>
      <div class="text-xs text-gray-400">Admin</div>
    </div>
    <button
      on:click={handleLogout}
      class="text-gray-400 hover:text-white transition-colors"
      title="Logout"
      aria-label="logout"
    >
      <i class="fas fa-sign-out-alt"></i>
    </button>
  </div>
</div>
</nav>
