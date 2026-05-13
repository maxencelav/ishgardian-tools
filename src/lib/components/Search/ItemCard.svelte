<script>
    import '@awesome.me/webawesome/dist/components/dropdown/dropdown.js';

    import { selectedLanguage } from "$lib/stores/settingsStore";
    import { languages } from "$lib/constants";

    export let item;

    function handleSelect(event) {
        console.log('Selected value:', event.detail.item.value);
        switch (event.detail.item.value) {
            case 'garland-tools':
                window.open(`https://garlandtools.org/db/#item/${item.row_id}`, '_blank');
                break;
            case 'cg-wiki':
                window.open(`https://ffxiv.consolegameswiki.com/wiki/${item.fields["Name@lang(en)"]}`, '_blank');
                break;
            case 'teamcraft':
                window.open(`https://ffxivteamcraft.com/db/${$selectedLanguage}/item/${item.row_id}`, '_blank');
                break;
            case 'universalis':
                window.open(`https://universalis.app/market/${item.row_id}`, '_blank');
                break;
        }
    }
</script>

<wa-card appearance="filled-outlined">
    <div class="wa-cluster wa-align-items-center wa-gap-s" slot="header">
        <wa-avatar 
            image={`https://beta.xivapi.com/api/1/asset?path=${item.fields.Icon.path}&format=webp`}
            shape="rounded"
            label="Icon for {item.fields['Name@lang(en)']}"
            loading="lazy"
        ></wa-avatar>
        <span class="wa-heading-s">{item.fields[`Name@lang(${$selectedLanguage})`]}</span>
    </div>
    <wa-dropdown on:wa-select={handleSelect} slot="header-actions">
        <wa-button slot="trigger" size="xs" appearance="plain">
            <wa-icon name="ellipsis" label="Actions"></wa-icon>
        </wa-button>

        <wa-dropdown-item href={`https://garlandtools.org/db/#item/${item.row_id}`} target="_blank" value="garland-tools">
            Open in Garland Tools
        </wa-dropdown-item>
        <wa-dropdown-item href={`https://ffxiv.consolegameswiki.com/wiki/${item.fields["Name@lang(en)"]}`} target="_blank" value="cg-wiki">
            Open in CG Wiki
        </wa-dropdown-item>
        <wa-dropdown-item href={`https://ffxivteamcraft.com/db/${$selectedLanguage}/item/${item.row_id}`} target="_blank" value="teamcraft">
            Open in Teamcraft
        </wa-dropdown-item>
        <wa-dropdown-item href={`https://universalis.app/market/${item.row_id}`} target="_blank" value="universalis">
            Open in Universalis
        </wa-dropdown-item>
    </wa-dropdown>

    <span class="wa-caption-s">ITEM LEVEL {item.fields.LevelItem.value}</span>

    <div class="wa-stack wa-gap-0">
        {#each Object.entries(languages) as [code, name]}
            <div class="wa-cluster wa-align-items-center" style="width:100%;">
                <span class="wa-caption-s wa-fw-bold">{code[0].toUpperCase()}</span>
                <wa-copy-button
                    value={item.fields[`Name@lang(${code})`]}
                    copy-label={`Copy "${item.fields[`Name@lang(${code})`]}" to clipboard`}
                    success-label="Copied!"
                    error-label="Copy failed"
                >
                    <wa-button
                        appearance="plain"
                        size="xs"
                        style="width: 100%;--wa-form-control-padding-block: 0.25rem; --wa-form-control-padding-inline: 0.5rem;"
                    >
                        {item.fields[`Name@lang(${code})`]}
                    </wa-button>
                </wa-copy-button>
            </div>
        {/each}
    </div>

    <div class="wa-body-s">
        {@html item.fields[`Description@lang(${$selectedLanguage})`].replace(/\n/g, '<br>')}
    </div>
</wa-card>
