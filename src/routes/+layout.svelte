<script>
    import { onMount } from 'svelte';
    import "../app.css";
    import { selectedLanguage } from '$lib/stores/settingsStore';
    import { t } from '$lib/i18n';

    import '@awesome.me/webawesome/dist/components/page/page.js';
    import '@awesome.me/webawesome/dist/components/card/card.js';
    import '@awesome.me/webawesome/dist/components/button/button.js';
    import '@awesome.me/webawesome/dist/components/badge/badge.js';
    import '@awesome.me/webawesome/dist/components/avatar/avatar.js';
    import '@awesome.me/webawesome/dist/components/icon/icon.js';
    import '@awesome.me/webawesome/dist/components/icon/library.default.js';
    import '@awesome.me/webawesome/dist/components/input/input.js';
    import '@awesome.me/webawesome/dist/components/select/select.js';
    import '@awesome.me/webawesome/dist/components/option/option.js';
    import '@awesome.me/webawesome/dist/components/copy-button/copy-button.js';
    import '@awesome.me/webawesome/dist/components/progress-ring/progress-ring.js';
    import '@awesome.me/webawesome/dist/components/divider/divider.js';

    let theme = 'light';
    let currentLang = 'en';

    $: currentLang = $selectedLanguage;

    function applyTheme(value) {
        theme = value;

        if (typeof document !== 'undefined') {
            document.documentElement.classList.toggle('wa-dark', value === 'dark');
            localStorage.setItem('theme', value);
        }
    }

    function toggleTheme() {
        applyTheme(theme === 'dark' ? 'light' : 'dark');
    }

    function changeLanguage(event) {
        selectedLanguage.set(event.target.value);
    }

    onMount(() => {
        const storedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
        applyTheme(storedTheme ?? (prefersDark ? 'dark' : 'light'));
    });
</script>

<wa-page class="min-h-screen font-sans text-black dark:text-white">
    <div slot="header" class="wa-cluster wa-align-items-center wa-justify-content-space-between" style="padding:1rem 1.5rem; width:100%;">
        <a href="/" class="wa-cluster" style="text-decoration:none; color:inherit;">
          <wa-icon name="dragon" style="color: var(--wa-color-brand-fill-loud); font-size: 1.5em; --rotate-angle: 0deg;" aria-hidden="true" library="default" rotate="0"></wa-icon>
          <span id="brand-name" class="wa-heading-m wa-desktop-only">Ishgardian Tools</span>
        </a>

        <div class="wa-cluster">
            <wa-select value={currentLang} on:input={changeLanguage} appearance="filled" size="s">
                <wa-option value="en">English</wa-option>
                <wa-option value="fr">Français</wa-option>
                <wa-option value="ja">日本語</wa-option>
                <wa-option value="de">Deutsch</wa-option>
            </wa-select>

            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <wa-button appearance="plain" size="s" on:click={toggleTheme}>
                <wa-icon name={theme === 'dark' ? 'moon' : 'sun'} variant="solid" class="wa-font-size-xl"></wa-icon>
            </wa-button>
        </div>
        
    </div>

    <div slot="navigation" class="wa-stack wa-gap-s" style="padding:1.5rem 1rem;">
        <div class="wa-stack wa-gap-xs">
            <form action="/search" method="get" class="wa-flank:end wa-gap-xs">
                <wa-input type="text" name="query" placeholder={t('search_placeholder', currentLang)}></wa-input>
                <wa-button type="submit" variant="neutral" appearance="accent"><wa-icon name="magnifying-glass" label="Search"></wa-icon></wa-button>
            </form>


            
            <wa-button appearance="plain" href="/item">
                <wa-icon slot="start" name="box"></wa-icon>
                Items
            </wa-button>
            <wa-button appearance="plain" href="/npc">
                <wa-icon slot="start" name="user"></wa-icon>
                NPCs
            </wa-button>
            <wa-button appearance="plain" href="/collect-check">
                <wa-icon slot="start" name="check"></wa-icon>
                FFXIV Collect Check
            </wa-button>
        </div>
    </div>

    <slot />

    <div slot="footer">
        ALL FINAL FANTASY XIV CONTENT IS PROPERTY OF SQUARE ENIX CO., LTD.
    </div>
</wa-page>