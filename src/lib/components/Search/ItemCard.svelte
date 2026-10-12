<script>
    import ClickToCopy from "./ClickToCopy.svelte";
    import { selectedLanguage } from "$lib/stores/settingsStore";
    import { languages } from "$lib/constants";
    import { assetUrl } from "$lib/xivapi";

    export let item = null;
    // Render a placeholder with the same layout as a real card,
    export let skeleton = false;

    const bar = "rounded bg-zinc-300 dark:bg-zinc-700";
    // Vary the placeholder widths so the language names don't look identical
    const nameWidths = ["w-1/2", "w-2/5", "w-3/5", "w-1/3"];
</script>

<li
    class="rounded overflow-hidden drop-shadow-md bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-200 flex flex-col border border-zinc-500/30 z-20 w-full"
    class:animate-pulse={skeleton}
    aria-hidden={skeleton || undefined}
>
    {#if skeleton}
        <div class="flex items-center gap-2 p-2">
            <div class="w-10 h-10 rounded {bar}"></div>
            <div class="h-4 w-2/3 {bar}"></div>
        </div>

        <div
            class="bg-zinc-200 dark:bg-zinc-950/50 w-full px-2 pt-0.5 pb-1 mb-2"
        >
            <div class="h-3 w-24 {bar}"></div>
        </div>

        <div class="px-2 text-xs mb-1">
            {#each Object.keys(languages) as code, index}
                <p class="mb-1 flex items-start">
                    <span
                        class="bg-zinc-300 text-zinc-800 inline-block text-center w-5 mr-2 py-0.5 rounded dark:bg-zinc-700 dark:text-zinc-300"
                    >
                        {code[0].toUpperCase()}
                    </span>
                    <span class="mt-1.5 h-3 {nameWidths[index]} {bar}"></span>
                </p>
            {/each}
        </div>

        <div class="px-2 mb-2 grow space-y-2 py-1">
            <div class="h-3 w-full {bar}"></div>
            <div class="h-3 w-11/12 {bar}"></div>
            <div class="h-3 w-2/3 {bar}"></div>
        </div>

        <div class="border-t border-zinc-500/30 flex">
            {#each Array(4) as _}
                <div class="grow flex items-center justify-center px-2 h-7">
                    <div class="h-3.5 w-16 {bar}"></div>
                </div>
            {/each}
        </div>
    {:else}
        <div class="flex items-center gap-2 p-2">
            <img
                class="w-10 h-10 rounded"
                src={assetUrl(item.fields.Icon.path)}
                alt={`Icon for ${item.fields["Name@lang(en)"]}`}
            />
            <h2>{item.fields[`Name@lang(${$selectedLanguage})`]}</h2>
        </div>

        <p
            class="bg-zinc-200 text-zinc-600 dark:bg-zinc-950/50 dark:text-zinc-300 w-full text-xs uppercase tabular-nums inline-block px-2 pb-0.5 mb-2"
        >
            ITEM LEVEL {item.fields["LevelItem@as(raw)"]}
        </p>

        <div class="px-2 text-xs mb-1">
            {#each Object.entries(languages) as [code, name]}
                <p
                    class="text-zinc-700 dark:text-zinc-300 mb-1 select-none flex items-start"
                >
                    <span
                        class="bg-zinc-300 text-zinc-800 inline-block text-center w-5 mr-2 py-0.5 rounded dark:bg-zinc-700 dark:text-zinc-300 select-none"
                    >
                        {code[0].toUpperCase()}
                    </span>
                    <ClickToCopy
                        text={item.fields[`Name@lang(${code})`]}
                        className="hover:underline cursor-pointer text-start mt-0.5"
                    >
                        {name}
                    </ClickToCopy>
                </p>
            {/each}
        </div>

        <p class="px-2 mb-2 text-zinc-700 dark:text-zinc-300 text-sm grow whitespace-pre-line">
            {item.fields[`Description@lang(${$selectedLanguage})`]}
        </p>

        <div
            class="border-t border-zinc-500/30 flex justify-items-stretch text-xs grid-cols-4"
        >
            <a
                href={`https://garlandtools.org/db/#item/${item.row_id}`}
                target="_blank"
                rel="noopener noreferrer"
                class="block grow text-center px-2 py-1 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-900"
            >
                Garland Tools
            </a>

            <a
                href={`https://ffxiv.consolegameswiki.com/wiki/${item.fields["Name@lang(en)"]}`}
                target="_blank"
                rel="noopener noreferrer"
                class="block grow text-center px-2 py-1 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-900"
            >
                CG Wiki
            </a>

            <a
                href={`https://ffxivteamcraft.com/db/${$selectedLanguage}/item/${item.row_id}`}
                target="_blank"
                rel="noopener noreferrer"
                class="block grow text-center px-2 py-1 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-900"
            >
                Teamcraft
            </a>

            <a
                href={`https://universalis.app/market/${item.row_id}`}
                target="_blank"
                rel="noopener noreferrer"
                class="block grow text-center px-2 py-1 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-900"
            >
                Universalis
            </a>
        </div>
    {/if}
</li>
