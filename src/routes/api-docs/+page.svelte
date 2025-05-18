<script>
  import ApiDocs from '../../components/ApiDocs.svelte';

  export let data;
  const { apiDocs } = data;
</script>

<ApiDocs {apiDocs} />
