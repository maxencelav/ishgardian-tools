<script>
    import ClickToCopy from "./ClickToCopy.svelte";
    
    // Define any props or reactive variables needed
    export let item;
    export let selectedLanguage = "en";
    export let languages = { en: "English", jp: "Japanese" }; // Define or receive the languages object
</script>

<li class="rounded overflow-hidden drop-shadow-md bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-200 flex flex-col border border-zinc-500/30 z-20 w-full">
    <div class="flex items-center gap-2 p-2">
        <img 
            class="w-10 h-10 rounded"
            src={`https://beta.xivapi.com/api/1/asset?path=${item.fields.Icon.path}&format=jpg`}
            alt={`Icon for ${item.fields['Name@lang(en)']}`}
        />
        <h3>{item.fields[`Name@lang(${selectedLanguage})`]}</h3>
    </div>

    <p class="bg-zinc-200 text-zinc-600 dark:bg-zinc-950/50 dark:text-zinc-300 w-full text-xs uppercase tabular-nums inline-block px-2 pb-0.5 font-wide mb-2">
        ITEM LEVEL {item.fields.LevelItem.value}
    </p>

    <div class="px-2 text-xs mb-1">
        {#each Object.entries(languages) as [code, name]}
            <p class="text-zinc-700 dark:text-zinc-300 mb-1 select-none flex items-start">
                <span class="bg-zinc-300 text-zinc-800 inline-block text-center w-5 mr-2 py-0.5 rounded dark:bg-zinc-700 dark:text-zinc-300 select-none">
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

    <p class="px-2 mb-2 text-zinc-700 dark:text-zinc-300 text-sm">
        {item.fields[`Description@lang(${selectedLanguage})`]}
    </p>
</li>
