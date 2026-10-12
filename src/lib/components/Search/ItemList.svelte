<script>
    import ItemCard from "./ItemCard.svelte";

    export let items;
    export let searchQuery;
    export let fetching;
</script>

{#if fetching}
    <ul class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full" aria-busy="true" aria-label="Loading results">
        {#each Array(6) as _}
            <ItemCard skeleton />
        {/each}
    </ul>
{:else if items.length > 0}
    <ul class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each items as item}
            <ItemCard {item} />                
        {/each}
    </ul>
{:else if searchQuery}
    <p class="text-center text-stone-300 dark:text-zinc-300">No items found for "{searchQuery}".</p>
{/if}
