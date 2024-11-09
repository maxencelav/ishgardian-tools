<script>
    import { onMount } from 'svelte';

    export let searchQuery = ''; // Added default value
    export let selectedLanguage = 'en'; // Added default value

    const languages = {
        en: 'English',
        fr: 'French',
        de: 'German',
        ja: 'Japanese',
    };

    // On page load, focus the search input
    onMount(() => {
        const searchInput = document.querySelector('.search-input');
        searchInput.focus();
    });
</script>

<div id="search-controls" class="d-flex gap-1 mb-2">
    <select bind:value={selectedLanguage} id="language-select" class="p-2 border rounded min-w-120">
        {#each Object.entries(languages) as [code, name]}
            <option value={code}>{name}</option>
        {/each}
    </select>

    <input
        id="search-input" 
        class="flex-1 p-2 border rounded"
        type="text"
        bind:value={searchQuery}
        placeholder="Search items..."
        on:input={() => console.log('Search query:', searchQuery)}
    />
</div>