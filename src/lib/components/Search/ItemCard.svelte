<li class="bg-gray-100 rounded p-4 block">

    <div class="flex items-center mb-4 gap-2">
        <img 
            class="w-10 h-10 rounded"
            src={`https://beta.xivapi.com/api/1/asset?path=${item.fields.Icon.path}&format=jpg`}
            alt={`Icon for ${item.fields['Name@lang(en)']}`}
        />
        <h3>{item.fields['Name@lang('+selectedLanguage+')']}</h3>
    </div>
    <p class="bg-stone-700 text-stone-300 dark:bg-zinc-950/50 dark:text-zinc-300 w-full text-xs font-semibold uppercase tabular-nums inline-block mb-2 px-2 pb-1 pt-0.5 font-wide min-h-6">
        ITEM LEVEL {item.fields.LevelItem.value}
    </p>


    <div class="translations">
        {#each Object.entries(languages) as [code, name]}
            <p class="text-zinc-700 dark:text-zinc-300 text-sm mb-1 select-none">
                <span class="bg-zinc-100 text-zinc-800 text-xs font-medium inline-block text-center w-5 mr-2 py-0.5 rounded dark:bg-zinc-700 dark:text-zinc-300 select-none">
                    {code[0]}
                </span>
                <button
                    class="hover:underline cursor-pointer"
                    type="button"
                    title={`Click to copy ${name} translation`}
                    on:click={() => navigator.clipboard.writeText(item.fields['Name@lang('+code+')'])}
                >
                    {item.fields['Name@lang('+code+')']}
                </button>
            </p>
        {/each}
    </div>
</li>