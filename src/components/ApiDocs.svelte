<script lang="ts">
  export let apiDocs: any;
  let selectedEndpoint: string | null = null;

  function toggleEndpoint(path: string) {
    selectedEndpoint = selectedEndpoint === path ? null : path;
  }

  // Method badge colors
  const methodColors = {
    get: 'bg-blue-100 text-blue-700 border border-blue-200',
    post: 'bg-green-100 text-green-700 border border-green-200',
    put: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    delete: 'bg-red-100 text-red-700 border border-red-200',
    patch: 'bg-purple-100 text-purple-700 border border-purple-200'
  };

  // ... previous code ...

  // Helper function to format JSON schema
  function formatSchema(schema: any) {
    if (!schema) return '';
    return JSON.stringify(schema, null, 2);
  }

  // Helper function to determine if a response has content
  function hasContent(response: any) {
    return response.content && Object.keys(response.content).length > 0;
  }

  // Helper function to get example value
  function getExampleValue(example: any) {
    return example?.value || example;
  }
</script>

<div class="min-h-screen bg-gray-50 py-8">
  <div class="container mx-auto px-4 max-w-6xl">
    <header class="mb-8">
      <h1 class="text-4xl font-bold text-gray-900 mb-2">API Documentation</h1>
      {#if apiDocs?.info}
        <p class="text-gray-600 text-lg">{apiDocs.info.description || ''}</p>
        <div class="mt-4 flex gap-4">
          <span class="text-sm bg-gray-100 px-3 py-1 rounded-full">
            Version: {apiDocs.info.version}
          </span>
          {#if apiDocs.info.contact}
            <span class="text-sm bg-gray-100 px-3 py-1 rounded-full">
              Contact: {apiDocs.info.contact.email}
            </span>
          {/if}
        </div>
      {/if}
    </header>

    {#if apiDocs?.paths}
      <div class="space-y-6">
        {#each Object.entries(apiDocs.paths) as [path, methods]}
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <button
              class="w-full text-left p-4 hover:bg-gray-50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              on:click={() => toggleEndpoint(path)}
              aria-expanded={selectedEndpoint === path}
              role="button"
            >
              <div class="flex items-center justify-between">
                <h2 class="text-xl font-semibold text-gray-900">{path}</h2>
                <svg
                  class="w-5 h-5 text-gray-500 transform transition-transform duration-200 {selectedEndpoint === path ? 'rotate-180' : ''}"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {#if selectedEndpoint === path}
              <div class="border-t border-gray-200 divide-y divide-gray-200">
                {#each Object.entries(methods) as [method, details]}
                  <div class="p-4">
                    <div class="flex items-center gap-3 mb-4">
                      <span class="px-3 py-1 rounded-full text-sm font-medium uppercase tracking-wide {methodColors[method] || 'bg-gray-100 text-gray-700'}">
                        {method}
                      </span>
                      <h3 class="text-lg font-medium text-gray-900">{details.summary || ''}</h3>
                    </div>

                    {#if details.description}
                      <div class="mb-6 prose prose-sm max-w-none text-gray-600">
                        {details.description}
                      </div>
                    {/if}

                    {#if details.parameters}
                      <div class="mb-6">
                        <h4 class="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Parameters</h4>
                        <div class="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                          <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-100">
                              <tr>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Required</th>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                              </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200">
                              {#each details.parameters as param}
                                <tr class="hover:bg-gray-50">
                                  <td class="px-4 py-2 text-sm font-medium text-gray-900">{param.name}</td>
                                  <td class="px-4 py-2 text-sm text-gray-600">{param.in}</td>
                                  <td class="px-4 py-2">
                                    {#if param.required}
                                      <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                        Required
                                      </span>
                                    {:else}
                                      <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                        Optional
                                      </span>
                                    {/if}
                                  </td>
                                  <td class="px-4 py-2 text-sm text-gray-600">{param.description || '-'}</td>
                                </tr>
                              {/each}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    {/if}

                   {#if details.responses}
  <div class="mb-6">
    <h4 class="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Responses</h4>
    <div class="space-y-3">
      {#each Object.entries(details.responses) as [code, response]}
        <div class="bg-gray-50 rounded-lg border border-gray-200">
          <!-- Response Header -->
          <div class="border-b border-gray-200 p-4">
            <div class="flex items-center gap-2">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                {code.startsWith('2') ? 'bg-green-100 text-green-800' : ''}
                {code.startsWith('4') ? 'bg-yellow-100 text-yellow-800' : ''}
                {code.startsWith('5') ? 'bg-red-100 text-red-800' : ''}">
                {code}
              </span>
              <span class="text-sm font-medium text-gray-900">{response.description || ''}</span>
            </div>
          </div>

          {#if response.content}
            <div class="p-4">
              <!-- Response Schema -->
              {#each Object.entries(response.content) as [contentType, content]}
                <div class="mb-4">
                  <h5 class="text-xs font-semibold text-gray-700 mb-2">Content Type: {contentType}</h5>
                  
                  {#if content.schema}
                    <div class="mb-4">
                      <h6 class="text-xs font-medium text-gray-600 mb-2">Schema</h6>
                      <div class="bg-gray-800 rounded-lg p-4 overflow-x-auto">
                        <pre class="text-sm text-gray-100">{JSON.stringify(content.schema, null, 2)}</pre>
                      </div>
                    </div>
                  {/if}

                  <!-- Response Example -->
                  {#if content.example || content.examples}
                    <div>
                      <h6 class="text-xs font-medium text-gray-600 mb-2">Example</h6>
                      <div class="bg-gray-800 rounded-lg p-4 overflow-x-auto">
                        {#if content.example}
                          <pre class="text-sm text-gray-100">{JSON.stringify(content.example, null, 2)}</pre>
                        {:else if content.examples}
                          <div class="space-y-4">
                            {#each Object.entries(content.examples) as [exampleName, example]}
                              <div>
                                <div class="text-xs text-gray-400 mb-1">{exampleName}</div>
                                <pre class="text-sm text-gray-100">{JSON.stringify(example.value, null, 2)}</pre>
                              </div>
                            {/each}
                          </div>
                        {/if}
                      </div>
                    </div>
                  {/if}
                </div>
              {/each}
            </div>
          {/if}

          <!-- Headers if present -->
          {#if response.headers}
            <div class="border-t border-gray-200 p-4">
              <h6 class="text-xs font-semibold text-gray-700 mb-2">Headers</h6>
              <div class="bg-white rounded-lg border border-gray-200">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Header</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Type</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Description</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200">
                    {#each Object.entries(response.headers) as [headerName, header]}
                      <tr>
                        <td class="px-4 py-2 text-sm font-medium text-gray-900">{headerName}</td>
                        <td class="px-4 py-2 text-sm text-gray-600">{header.schema?.type || '-'}</td>
                        <td class="px-4 py-2 text-sm text-gray-600">{header.description || '-'}</td>
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </div>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
{/if}                  </div>
                {/each}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    {:else}
      <div class="text-center py-12 bg-white rounded-lg shadow-sm">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No API documentation available</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by adding your API documentation.</p>
      </div>
    {/if}
  </div>
</div>
