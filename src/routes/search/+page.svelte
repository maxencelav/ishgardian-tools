<script>
    import { onMount } from 'svelte';
    import SearchBar from '$lib/components/SearchBar.svelte';
    import ItemList from '$lib/components/ItemList.svelte';

    let items = [];
    let searchQuery = '';
    let filteredItems = [];
    let selectedLanguage = 'en';

    async function searchItems(query) {
        if (query.trim()) {
            try {
                const response = await fetch(`https://beta.xivapi.com/api/1/search?sheets=Item&query=(Name@en~"${encodeURIComponent(query)}" Name@ja~"${encodeURIComponent(query)}" Name@fr~"${encodeURIComponent(query)}" Name@de~"${encodeURIComponent(query)}")&fields=Name@lang(ja),Name@lang(en),Name@lang(fr),Name@lang(de),Icon,LevelItem`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                filteredItems = data.results; // Update filtered items
            } catch (error) {
                console.error('Error fetching items:', error);
                filteredItems = []; // Reset if there's an error
            }
        } else {
            filteredItems = []; // Reset if query is empty
        }
    }

    // Call searchItems with debounce when searchQuery changes
    let debounceTimeout;
    $: { // The dollar means this block will run on every reactive variable change (in this case, searchQuery)
        clearTimeout(debounceTimeout);
        if (searchQuery !== '') {
            debounceTimeout = setTimeout(() => {
                searchItems(searchQuery);
            }, 300);
        } else {
            filteredItems = []; // Reset if query is empty
        }
    }

    // On page load, if we have a query in the URL, search for it
    onMount(() => {
        const url = new URL(window.location.href);
        const query = url.searchParams.get('query');
        if (query) {
            searchQuery = query;
        }
    });

    // When the search query changes, update the URL
    $: if (typeof window !== 'undefined') { // let's avoid SSR errors
        const url = new URL(window.location.href);
        url.searchParams.set('query', searchQuery);
        window.history.replaceState({}, '', url);
    }

</script>

<main class="container">
    <SearchBar bind:searchQuery bind:selectedLanguage />
    <ItemList items={filteredItems} selectedLanguage={selectedLanguage} />
</main>
