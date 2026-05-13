<script>
    import ItemCard from "./ItemCard.svelte";

    export let items;
    export let searchQuery;
    export let fetching;
</script>

{#if items.length > 0}
    <div class="wa-grid wa-gap-4xl" style="--min-column-size: 30ch; width:100%;">
        {#each items as item}
            <ItemCard {item} />
        {/each}
    </div>
{:else}
    {#if searchQuery && !fetching}
        <p class="wa-caption-s" style="text-align:center;">No items found for "{searchQuery}".</p>
    {/if}
{/if}
