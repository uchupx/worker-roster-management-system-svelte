<script>
  import { onMount } from 'svelte';
  import { Calendar } from '@fullcalendar/core';
  import dayGridPlugin from '@fullcalendar/daygrid';
  import interactionPlugin from '@fullcalendar/interaction';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

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
      datesSet: (info) => {
    dispatch('monthChange', { start: info.start, end: info.end });
        }
    });

    calendarInstance.render();
  });

  $: if (shifts) {
    console.log('Shifts updated:', shifts);
      if (calendarInstance) {
        calendarInstance.removeAllEvents();
        calendarInstance.addEventSource({ events: shifts });
      }
    }
</script>

<div bind:this={calendarEl} class="calendar-container"></div>

<style>
  .calendar-container {
    max-width: 100%;
    margin: 0 auto;
  }
</style>

