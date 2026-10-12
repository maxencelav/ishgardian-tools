<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { selectedLanguage } from "$lib/stores/settingsStore";

  // Initialize with null or undefined
  let characterInputs = writable(null);
  let dataType = writable('mounts');
  let results = writable(null);
  let loading = writable(false);
  let error = writable(null);
  let searchTerm = writable('');

  onMount(() => {
    const loadSavedData = () => {
      const savedCharacters = localStorage.getItem('ffxivCharacters');
      if (savedCharacters) {
        try {
          characterInputs.set(JSON.parse(savedCharacters));
        } catch (e) {
          console.error('Failed to parse saved characters', e);
          // Optionally, reset to default or handle the error as needed
          characterInputs.set([{ id: '', info: null }]);
        }
      } else {
        // If nothing is in localStorage, set the default value
        characterInputs.set([{ id: '', info: null }]);
      }
    };

    loadSavedData();
  });

  $: if (typeof window !== 'undefined' && $characterInputs) {
    localStorage.setItem('ffxivCharacters', JSON.stringify($characterInputs));
  }

  const handleAddCharacter = () => {
    characterInputs.update(inputs => [...inputs, { id: '', info: null }]);
  };

  const handleRemoveCharacter = (index) => {
    characterInputs.update(inputs => inputs.filter((_, i) => i !== index));
  };

  const fetchCharacterInfo = async (id) => {
    const response = await fetch(`https://ffxivcollect.com/api/characters/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch character info');
    }
    return await response.json();
  };

  let debounceTimers = {};

  const handleCharacterIdChange = (index, value) => {
    characterInputs.update(inputs => {
      inputs[index].id = value;
      inputs[index].info = null;
      return inputs;
    });

    clearTimeout(debounceTimers[index]);

    if (!value.trim()) return;

    debounceTimers[index] = setTimeout(async () => {
      try {
        const info = await fetchCharacterInfo(value);
        characterInputs.update(inputs => {
          if (inputs[index]) inputs[index].info = info;
          return inputs;
        });
      } catch (error) {
        console.error(`Error fetching character info: ${error}`);
        characterInputs.update(inputs => {
          if (inputs[index]) inputs[index].info = null;
          return inputs;
        });
      }
    }, 400);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    loading.set(true);
    error.set(null);
    results.set(null);

    const ids = $characterInputs.map(input => input.id.trim()).filter(id => id !== '');
    if (ids.length === 0) {
      error.set('Please enter at least one valid Lodestone ID.');
      loading.set(false);
      return;
    }

    try {
      const response = await fetch('/api/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, dataType: $dataType, language: $selectedLanguage })
      });
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      results.set(data);
    } catch (err) {
      error.set(err.message);
    } finally {
      loading.set(false);
    }
  };

  const sortedItems = () => {
    if (!$results) return [];

    const allItems = new Set();
    Object.values($results).forEach(result => {
      if (Array.isArray(result)) {
        result.forEach(item => allItems.add(item.id));
      }
    });

    let items = Array.from(allItems).map(itemId => {
      const item = Object.values($results).find(result => 
        Array.isArray(result) && result.find(i => i.id === itemId)
      )?.find(i => i.id === itemId);

      return {
        id: itemId,
        name: item.name,
        icon: item.icon,
        url: `https://ffxivcollect.com/${$dataType}/${itemId}`,
        characters: $characterInputs.map(input => ({
          id: input.id,
          has: Array.isArray($results[input.id]) 
            ? $results[input.id].some(i => i.id === itemId)
            : null
        }))
      };
    });

    // Filter items based on search term
    items = items.filter(item => 
      item.name.toLowerCase().includes($searchTerm.toLowerCase())
    );

    // Always sort by name
    items.sort((a, b) => a.name.localeCompare(b.name));

    return items;
  };
</script>

<svelte:head>
  <title>Collection Check — Ishgardian Tools</title>
  <meta
    name="description"
    content="Compare mounts, minions and orchestrion rolls missing across multiple FFXIV characters."
  />
</svelte:head>

<div class="min-h-screen min-w-full flex flex-col w-full">
  <div class="w-full grow flex flex-col sm:flex-row">
    <div class="w-full sm:w-1/4 sm:shrink-0 p-4 border-b sm:border-b-0 sm:border-r border-zinc-500/30">
      <h1 class="text-2xl mb-4">FFXIV Collect Check<br><small>(in testing!)</small></h1>
      <form on:submit|preventDefault={handleSubmit}>
        {#each $characterInputs as input, index}
          <div class="mb-3">
            <div class="flex gap-2">
              <input
                type="text"
                inputmode="numeric"
                class="block w-full text-base sm:text-sm text-zinc-700 bg-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:border-transparent p-2"
                bind:value={input.id}
                on:input={(e) => handleCharacterIdChange(index, e.target.value)}
                placeholder="Enter Lodestone ID"
                required
              />
              <button type="button" class="shrink-0 border border-red-500 text-red-500 hover:bg-red-500/10 rounded-lg px-3 py-2 cursor-pointer" on:click={() => handleRemoveCharacter(index)}>Remove</button>
            </div>
            {#if input.info}
              <div class="flex items-center mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                <img src={input.info.avatar} alt={input.info.name} class="w-6 h-6 rounded-full mr-2" />
                <span>{input.info.name} - {input.info.server}</span>
              </div>
            {/if}
          </div>
        {/each}
        <button type="button" class="mb-3 w-full sm:w-auto bg-zinc-600 hover:bg-zinc-700 text-white font-bold rounded-lg px-4 py-2 cursor-pointer" on:click={handleAddCharacter}>Add Character</button>
        <div class="mb-3">
          <label for="dataType" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Data Type:</label>
          <select
            id="dataType"
            class="block w-full text-base sm:text-sm text-zinc-700 bg-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:border-transparent p-2"
            bind:value={$dataType}
          >
            <option value="mounts">Mounts</option>
            <option value="minions">Minions</option>
            <option value="orchestrions">Orchestrions</option>
          </select>
        </div>
        <button type="submit" class="w-full sm:w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-lg px-4 py-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" disabled={$loading}>
          {$loading ? 'Checking...' : 'Check Missing Items'}
        </button>
      </form>
      {#if $error}
        <p class="mt-3 text-red-500">Error: {$error}</p>
      {/if}
      {#if $loading}
        <p class="mt-3">Loading...</p>
      {/if}
    </div>
    <div class="w-full sm:w-3/4 p-4 min-w-0">
      {#if $results}
        <div class="flex flex-col sm:h-[calc(100dvh-3.5rem)]">
          <div class="sm:sticky sm:top-0 bg-zinc-100 dark:bg-zinc-900 z-20 pb-3">
            <input
              type="text"
              class="block w-full text-base sm:text-sm text-zinc-700 bg-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:border-transparent p-2"
              placeholder="Search items..."
              bind:value={$searchTerm}
            />
          </div>
          <div class="-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto sm:overflow-y-auto sm:flex-grow">
            <table class="table-auto w-full border-collapse border border-zinc-500/30 text-sm">
              <thead class="sm:sticky sm:top-0 bg-zinc-100 dark:bg-zinc-800 z-10">
                <tr>
                  <th class="sticky left-0 z-10 bg-zinc-100 dark:bg-zinc-800 border border-zinc-500/30 p-2 text-left">Item</th>
                  {#each $characterInputs as input, index}
                    {#if input.info}
                      <th class="border border-zinc-500/30 p-2 whitespace-nowrap">
                        <div class="flex flex-col items-center">
                          <img src={input.info.avatar} alt={input.info.name} class="w-8 h-8 sm:w-12 sm:h-12 rounded-full" />
                          <div>{input.info.name}</div>
                          <div>{input.info.server}</div>
                        </div>
                      </th>
                    {/if}
                  {/each}
                </tr>
              </thead>
              <tbody>
                {#each sortedItems() as item}
                  <tr>
                    <td class="sticky left-0 z-10 bg-zinc-100 dark:bg-zinc-800 border border-zinc-500/30 p-2">
                      <div class="flex items-center min-w-[180px]">
                        <img src={item.icon} alt={item.name} class="w-8 h-8 mr-2 shrink-0" />
                        <a href={item.url} target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">{item.name}</a>
                      </div>
                    </td>
                    {#each item.characters as character, index}
                      {#if character.id}
                        <td class="border border-zinc-500/30 p-2 text-center">
                          {character.has === null ? '❓' : (character.has ? '❌' : '✅')}
                        </td>
                      {/if}
                    {/each}
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>