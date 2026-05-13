<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

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

<main style="min-height:100vh; width:100%;">
  <div class="wa-cluster wa-align-items-start wa-gap-xl" style="max-width:88rem; margin-inline:auto; width:100%; padding:1.5rem; align-items:flex-start;">
    <wa-card appearance="filled-outlined" style="width:24rem; flex-shrink:0;">
      <div class="wa-stack wa-gap-s" style="padding:1rem;">
        <div>
          <span class="wa-heading-l">FFXIV Collect Check</span>
          <div class="wa-caption-s">(in testing!)</div>
        </div>

        <form on:submit|preventDefault={handleSubmit} class="wa-stack wa-gap-s">
          {#each $characterInputs as input, index}
            <wa-card appearance="filled-outlined" style="width:100%;">
              <div class="wa-cluster wa-align-items-center wa-gap-s" style="padding:0.75rem;">
                <wa-input
                  label={`Lodestone ID ${index + 1}`}
                  type="text"
                  value={input.id}
                  on:input={(e) => handleCharacterIdChange(index, e.target.value)}
                  placeholder="Enter Lodestone ID"
                  required
                  style="flex:1;"
                ></wa-input>
                <wa-button type="button" role="button" tabindex="0" appearance="plain" variant="danger" size="s" on:click={() => handleRemoveCharacter(index)}>
                  Remove
                </wa-button>
              </div>

              {#if input.info}
                <div class="wa-cluster wa-align-items-center wa-gap-s" style="padding:0 0.75rem 0.75rem;">
                  <img src={input.info.avatar} alt={input.info.name} style="width:2rem; height:2rem; border-radius:999px;" />
                  <div>
                    <div class="wa-caption-s">{input.info.name}</div>
                    <div class="wa-caption-xs">{input.info.server}</div>
                  </div>
                </div>
              {/if}
            </wa-card>
          {/each}

          <wa-button type="button" role="button" tabindex="0" appearance="accent" variant="brand" size="s" on:click={handleAddCharacter}>
            Add Character
          </wa-button>

          <wa-select
            label="Data Type"
            appearance="filled"
            value={$dataType}
            on:input={(event) => ($dataType = event.target.value)}
          >
            <wa-option value="mounts">Mounts</wa-option>
            <wa-option value="minions">Minions</wa-option>
            <wa-option value="orchestrions">Orchestrions</wa-option>
          </wa-select>

          <wa-button type="submit" appearance="filled" variant="brand" size="l" disabled={$loading}>
            {$loading ? 'Checking...' : 'Check Missing Items'}
          </wa-button>

          {#if $error}
            <div class="wa-caption-s" style="color:var(--wa-color-danger-60);">Error: {$error}</div>
          {/if}

          {#if $loading}
            <div class="wa-cluster wa-align-items-center wa-gap-2xs">
              <wa-progress-ring indeterminate></wa-progress-ring>
              <span class="wa-caption-s">Loading...</span>
            </div>
          {/if}
        </form>
      </div>
    </wa-card>

    <div style="flex:1; width:100%;">
        {#if $results}
          <wa-card appearance="filled-outlined" style="width:100%;">
            <div class="wa-stack wa-gap-s" style="padding:1rem;">
              <wa-input
                label="Search items"
                appearance="filled"
                value={$searchTerm}
                on:input={(event) => ($searchTerm = event.target.value)}
              ></wa-input>
              <div class="overflow-y-auto" style="max-height:70vh; width:100%;">
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
        </wa-card>
        {/if}
      </div>
    </div>
  </main>