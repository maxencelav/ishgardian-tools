<script>
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import SearchBar from "$lib/components/Search/SearchBar.svelte";
    import ItemList from "$lib/components/Search/ItemList.svelte";

    let items = [];
    let searchQuery = "";
    let filteredItems = [];
    let selectedLanguage = "en";
    let fetching = false;

    async function searchItems(query) {
        if (query.trim()) {
            fetching = true; // Start fetching
            try {
                const response = await fetch(
                    `https://beta.xivapi.com/api/1/search?sheets=Item&query=(Name@en~"${encodeURIComponent(query)}" Name@ja~"${encodeURIComponent(query)}" Name@fr~"${encodeURIComponent(query)}" Name@de~"${encodeURIComponent(query)}")&fields=Name@lang(ja),Name@lang(en),Name@lang(fr),Name@lang(de),Icon,LevelItem`,
                );
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                filteredItems = data.results; // Update filtered items
            } catch (error) {
                console.error("Error fetching items:", error);
                filteredItems = []; // Reset if there's an error
            } finally {
                fetching = false; // Stop fetching
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
            debounceTimeout = setTimeout(() => {
                searchItems(searchQuery);
            }, 300);
        } else {
            filteredItems = []; // Reset if query is empty
        }
    }

    // On page load, if we have a query in the URL, search for it
    let query;
    $: {
        searchQuery = $page.url.searchParams.get("query");
    }

    // When the search query changes, update the URL
    $: if (typeof window !== "undefined") {
        // let's avoid SSR errors
        const url = new URL(window.location.href);
        url.searchParams.set("query", searchQuery);
        window.history.replaceState({}, "", url);
    }
</script>

<main
    class="backdrop-filter backdrop-blur-lg bg-black/50 dark:bg-black/80 min-h-screen flex-col font-sans bg-fixed bg-cover bg-center pb-10"
>
    <h1
        class="font-header font-medium text-white w-full bg-black py-1 px-2 flex items-between"
    >
        <a href="/" class="text-white block hover:underline">
            Ishgardian Tools
        </a>
        <!-- <button
            class="text-white ms-auto block w-6 h-6 hover:bg-white/25 rounded-full text-center d-flex items-center justify-center"
        >
            ?
        </button> -->
    </h1>
    <div class="max-w-7xl mx-auto p-4">
        <SearchBar bind:searchQuery bind:selectedLanguage />
        <ItemList items={filteredItems} {selectedLanguage} {searchQuery} {fetching} />
    </div>
</main>
