<script>
  import { onMount } from 'svelte';
  import { Calendar } from '@fullcalendar/core';
  import dayGridPlugin from '@fullcalendar/daygrid';
  import interactionPlugin from '@fullcalendar/interaction';

  let calendarEl;
  let calendarInstance;

  export let shifts = [];

  onMount(() => {
    const calendarInstance = new Calendar(calendarEl, {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      events: shifts,
      editable: true, // Allow drag-and-drop
      selectable: true, // Allow date selection
      dateClick: (info) => {
        alert(`Clicked on: ${info.dateStr}`);
      },
      eventClick: (info) => {
        alert(`Event: ${info.event.title}`);
      },
    });

    calendarInstance.render();
  });

  $: if (calendarInstance && shifts) {
      calendarInstance.removeAllEvents();
      calendarInstance.addEventSource(shifts);
    }

</script>

<div bind:this={calendarEl} class="calendar-container"></div>

<style>
  .calendar-container {
    max-width: 100%;
    margin: 0 auto;
  }
</style>

