<script>
    import { selectedLanguage } from "$lib/stores/settingsStore";
    import { languages } from "$lib/constants";
    import { Globe, ChevronDown } from "@lucide/svelte";
</script>

<div class="relative font-normal">
    <Globe class="pointer-events-none absolute left-1 top-0.5 size-4 text-[#666]" aria-hidden="true" />

    <label for="language-select" class="sr-only">Language</label>
    <select
        bind:value={$selectedLanguage}
        id="language-select"
        class="appearance-none block w-36 h-5 rounded-[10px] bg-[#333] text-[#999] text-xs leading-5 px-6 cursor-pointer hover:text-[#ccc] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
        {#each Object.entries(languages) as [code, name]}
            <option value={code} class="bg-[#262626] text-[#ccc]">{name}</option>
        {/each}
    </select>

    <ChevronDown class="pointer-events-none absolute right-1 top-0.5 size-4 text-[#666]" strokeWidth={2.5} aria-hidden="true" />
</div>
