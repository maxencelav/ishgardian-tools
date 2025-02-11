<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import Navbar from "$lib/components/Navbar.svelte";

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

  const handleCharacterIdChange = async (index, value) => {
    characterInputs.update(inputs => {
      inputs[index].id = value;
      return inputs;
    });

    if (value.trim()) {
      try {
        const info = await fetchCharacterInfo(value);
        characterInputs.update(inputs => {
          inputs[index].info = info;
          return inputs;
        });
      } catch (error) {
        console.error(`Error fetching character info: ${error}`);
        characterInputs.update(inputs => {
          inputs[index].info = null;
          return inputs;
        });
      }
    } else {
      characterInputs.update(inputs => {
        inputs[index].info = null;
        return inputs;
      });
    }
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
        body: JSON.stringify({ ids, dataType: $dataType })
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

<main class="min-h-screen min-w-full flex flex-col w-full">
  <Navbar />
  <div class="mx-auto grow h-full w-full flex">
    <div class="flex grow">
      <div class="w-1/4 p-4 border-r border-gray-300 dark:border-gray-700">
        <h1 class="text-2xl mb-4">FFXIV Collect Check<br><small>(in testing!)</small></h1>
        <form on:submit|preventDefault={handleSubmit}>
          {#each $characterInputs as input, index}
            <div class="mb-3">
              <div class="flex">
                <input
                  type="text"
                  class="form-input block w-full sm:text-sm border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 bg-white dark:bg-gray-800 p-2"
                  bind:value={input.id}
                  on:input={(e) => handleCharacterIdChange(index, e.target.value)}
                  placeholder="Enter Lodestone ID"
                  required
                />
                <button type="button" class="ml-2 border border-red-500 text-red-500 rounded px-2 py-1" on:click={() => handleRemoveCharacter(index)}>Remove</button>
              </div>
              {#if input.info}
                <div class="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                  <img src={input.info.avatar} alt={input.info.name} class="w-6 h-6 rounded-full mr-2" />
                  <span>{input.info.name} - {input.info.server}</span>
                </div>
              {/if}
            </div>
          {/each}
          <button type="button" class="mb-3 bg-gray-500 text-white rounded px-4 py-2" on:click={handleAddCharacter}>Add Character</button>
          <div class="mb-3">
            <label for="dataType" class="block text-sm font-medium text-gray-700">Data Type:</label>
            <select
              id="dataType"
              class="form-select block w-full mt-1 border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 bg-white dark:bg-gray-800 p-2"
              bind:value={$dataType}
            >
              <option value="mounts">Mounts</option>
              <option value="minions">Minions</option>
              <option value="orchestrions">Orchestrions</option>
            </select>
          </div>
          <button type="submit" class="bg-blue-500 text-white rounded px-4 py-2" disabled={$loading}>
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
      <div class="w-3/4 p-4">
        {#if $results}
          <div class="flex flex-col h-full">
            <div class="sticky top-0 bg-white dark:bg-gray-800">
              <div class="mb-3">
                <input
                  type="text"
                  class="block w-full sm:text-sm border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  placeholder="Search items..."
                  bind:value={$searchTerm}
                />
              </div>
            </div>
            <div class="overflow-y-auto flex-grow">
              <table class="table-auto w-full border-collapse border border-gray-300 dark:border-gray-700">
                <thead class="sticky top-0 bg-white dark:bg-gray-800">
                  <tr>
                    <th class="border border-gray-300 dark:border-gray-700 p-2">Item</th>
                    {#each $characterInputs as input, index}
                      {#if input.info}
                        <th class="border border-gray-300 dark:border-gray-700 p-2">
                          <div class="flex flex-col items-center">
                            <img src={input.info.avatar} alt={input.info.name} class="w-12 h-12 rounded-full" />
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
                      <td class="border border-gray-300 dark:border-gray-700 p-2">
                        <div class="flex items-center">
                          <img src={item.icon} alt={item.name} class="w-8 h-8 mr-2" />
                          <a href={item.url} target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">{item.name}</a>
                        </div>
                      </td>
                      {#each item.characters as character, index}
                        {#if character.id}
                          <td class="border border-gray-300 dark:border-gray-700 p-2 text-center">
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
</main>