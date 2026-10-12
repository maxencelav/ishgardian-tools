<script>
    export let searchQuery = "";
    let searchInput;

    // Don't steal the focus as soon as the page loads.
    // However, if typing with no focus, automatically focus the search input
    function handleKeydown(event) {
        if (event.defaultPrevented || event.isComposing) return;
        if (event.ctrlKey || event.metaKey || event.altKey) return;
        if (event.key.length !== 1) return; // printable characters only
        const active = document.activeElement;
        if (active && active !== document.body) return;
        searchInput.focus();
    }
</script>

<svelte:window on:keydown={handleKeydown} />

<form id="search-controls" action="/search" method="get" role="search" class="flex flex-col sm:flex-row gap-1 sm:gap-2 mb-2 sm:mb-4 w-full animate-slide-fade-in">

    <label for="search-input" class="sr-only">Search items</label>
    <input
        id="search-input"
        bind:this={searchInput}
        class="px-3 sm:px-5 py-2 sm:py-3 text-zinc-700 bg-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:border-transparent grow"
        type="search"
        name="query"
        bind:value={searchQuery}
        placeholder="Search items..."
    />
    <button
        type="submit"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 sm:px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:border-transparent cursor-pointer"
    >
        Search
    </button>
</form>

