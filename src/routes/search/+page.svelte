<script>
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import { Toaster } from "svelte-hot-french-toast";
    import Navbar from "$lib/components/Navbar.svelte";
    import SearchBar from "$lib/components/Search/SearchBar.svelte";
    import ItemList from "$lib/components/Search/ItemList.svelte";

    let items = [];
    let searchQuery = "";
    let filteredItems = [];
    let fetching = false;

    async function searchItems(query) {
        if (query.trim()) {
            fetching = true; // Start fetching
            try {
                const response = await fetch(
                    `https://beta.xivapi.com/api/1/search?sheets=Item&query=(Name@en~"${encodeURIComponent(query)}" Name@ja~"${encodeURIComponent(query)}" Name@fr~"${encodeURIComponent(query)}" Name@de~"${encodeURIComponent(query)}")&fields=Name@lang(ja),Name@lang(en),Name@lang(fr),Name@lang(de),Icon,LevelItem,Description@lang(ja),Description@lang(en),Description@lang(fr),Description@lang(de)`,
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

<svelte:head>
    <title>Search — Ishgardian Tools</title>
    <meta
        name="description"
        content="Search Final Fantasy XIV items in English, Japanese, French or German."
    />
</svelte:head>

<main class="min-h-screen min-w-full flex flex-col w-full">
    <Toaster />
    <Navbar />
    <div class="max-w-7xl mx-auto p-4 grow h-full w-full flex flex-col items-center justify-center">
        <SearchBar bind:searchQuery />
        <div class="grow">
            <ItemList items={filteredItems} {searchQuery} {fetching} />
        </div>
        <p
            class="text-white font-light text-xs sm:text-sm text-center opacity-50 mt-8"
        >
            ALL FINAL FANTASY XIV CONTENT IS PROPERTY OF SQUARE ENIX CO., LTD.
        </p>
    </div>
</main>
