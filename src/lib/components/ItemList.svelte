<script>
    import ItemCard from "./Search/ItemCard.svelte";

    export let items;
    export let selectedLanguage;

    const languages = {
        en: 'English',
        fr: 'French',
        de: 'German',
        ja: 'Japanese',
    };

    $: {
        console.log(items);
    }
</script>

<div class="results">
    {#if items.length > 0}
        <ul class="grid grid-cols-[repeat(auto-fill,minmax(368px,1fr))] gap-4">
            {#each items as item}
                <ItemCard {item} {selectedLanguage} {languages} {ClickToCopy} />                
            {/each}
        </ul>
    {:else}
        <p class="text-center text-stone-300 dark:text-zinc-300">No items found.</p>
    {/if}
</div>