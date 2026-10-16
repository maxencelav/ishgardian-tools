<script>
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import SearchBar from "$lib/components/Search/SearchBar.svelte";
    import ItemList from "$lib/components/Search/ItemList.svelte";
    import { searchItems as fetchItems } from "$lib/xivapi";

    let items = [];
    let searchQuery = "";
    let filteredItems = [];
    let fetching = false;

    let latestRequest = 0;

    async function searchItems(query) {
        const request = ++latestRequest;
        if (query.trim()) {
            fetching = true; // Start fetching
            try {
                const results = await fetchItems(query);
                if (request !== latestRequest) return; // A newer search has started
                filteredItems = results; // Update filtered items
            } catch (error) {
                if (request !== latestRequest) return;
                console.error("Error fetching items:", error);
                filteredItems = []; // Reset if there's an error
            } finally {
                if (request === latestRequest) fetching = false; // Stop fetching
            }
        } else {
            filteredItems = []; // Reset if query is empty
            fetching = false; // Ensure fetching is false if query is empty
        }
    }

    // Call searchItems with debounce when searchQuery changes
    let debounceTimeout;
    $: {
        // The dollar means this block will run on every reactive variable change (in this case, searchQuery)
        clearTimeout(debounceTimeout);
        if (searchQuery !== "") {
            fetching = true; // Show the skeleton during the debounce too
            debounceTimeout = setTimeout(() => {
                searchItems(searchQuery);
            }, 300);
        } else {
            filteredItems = []; // Reset if query is empty
            fetching = false;
        }
    }

    // On page load, if we have a query in the URL, search for it
    let query;
    $: {
        searchQuery = $page.url.searchParams.get("query") ?? "";
    }

    // When the search query changes, update the URL
    $: if (typeof window !== "undefined") {
        // let's avoid SSR errors
        const url = new URL(window.location.href);
        url.searchParams.set("query", searchQuery);
        window.history.replaceState({}, "", url);
    }
</script>

<svelte:head>
    <title>Search — Ishgardian Tools</title>
    <meta
        name="description"
        content="Search Final Fantasy XIV items in English, Japanese, French or German."
    />
</svelte:head>

<div class="min-h-screen min-w-full flex flex-col w-full">
    <div class="max-w-7xl mx-auto p-4 grow h-full w-full flex flex-col items-center justify-center">
        <h1 class="sr-only">Search items</h1>
        <SearchBar bind:searchQuery />
        <div class="grow w-full">
            <ItemList items={filteredItems} {searchQuery} {fetching} />
        </div>
    </div>
</div>
