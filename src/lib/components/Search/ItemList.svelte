<script>
    import ItemCard from "./ItemCard.svelte";

    export let items;
    export let selectedLanguage;
    export let searchQuery;
    export let fetching;

    const languages = {
        en: 'English',
        fr: 'French',
        de: 'German',
        ja: 'Japanese',
    };
</script>

{#if items.length > 0}
    <ul class="grid sm:grid-cols-[repeat(auto-fill,minmax(368px,1fr))] gap-4">
        {#each items as item}
            <ItemCard {item} {selectedLanguage} {languages} />                
        {/each}
    </ul>
{:else}
    {#if searchQuery && !fetching}
        <p class="text-center text-stone-300 dark:text-zinc-300">No items found for "{searchQuery}".</p>
    {/if}
{/if}
