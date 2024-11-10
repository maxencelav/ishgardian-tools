<script>
    import { onMount } from "svelte";

    export let searchQuery = ""; // Added default value
    export let selectedLanguage = "en"; // Added default value

    const languages = {
        en: "English",
        fr: "French",
        de: "German",
        ja: "Japanese",
    };

    // On page load, focus the search input
    onMount(() => {
        const searchInput = document.querySelector("#search-input");
        searchInput.focus();
    });
</script>

<div id="search-controls" class="flex gap-1 mb-2 gap-2 mb-4">
    <select
        bind:value={selectedLanguage}
        id="language-select"
        class="px-5 py-3 text-zinc-700 bg-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:border-transparent"
    >
        {#each Object.entries(languages) as [code, name]}
            <option value={code}>{name}</option>
        {/each}
    </select>

    <input
        id="search-input"
        class="px-5 py-3 text-zinc-700 bg-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:border-transparent grow"
        type="text"
        bind:value={searchQuery}
        placeholder="Search items..."
        on:input={() => console.log("Search query:", searchQuery)}
    />
</div>
