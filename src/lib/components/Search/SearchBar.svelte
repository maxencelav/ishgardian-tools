<script>
    import { onMount } from "svelte";
    import { selectedLanguage } from "$lib/stores/settingsStore";
    import { languages } from "$lib/constants";

    export let searchQuery = "";

    onMount(() => {
        const searchInput = document.querySelector("wa-input");
        if (searchInput) searchInput.focus();
    });
</script>

<wa-input
    id="search-input"
    label="Search items"
    placeholder="Search items..."
    appearance="filled"
    value={searchQuery}
    on:input={(event) => (searchQuery = event.target.value)}
>
    <wa-icon slot="start" name="magnifying-glass" variant="solid"></wa-icon>
</wa-input>

