<svelte:head>
    <title>Ishgardian Tools — FFXIV multi-language search</title>
    <meta
        name="description"
        content="A multi-language search engine and toolkit for the Final Fantasy XIV MMORPG."
    />
</svelte:head>

<div
    class="w-full sm:max-w-xl md:max-w-2xl mx-auto my-auto p-2 px-4 sm:p-4 animate-slide-fade-in sm:rounded-lg"
>
    <h1
        class="mb-2 font-thin text-3xl sm:text-4xl md:text-6xl tracking-tighter"
    >
        Ishgardian Tools
    </h1>
    <p class="mb-4 font-light text-sm sm:text-base tracking-tight text-pretty">
        A multi-language search engine for the Final Fantasy XIV MMORPG.
    </p>

    <form
        action="/search"
        method="get"
        role="search"
        class="flex flex-col sm:flex-row justify-center w-full gap-2"
    >
        <label for="home-search" class="sr-only">Search items</label>
        <input
            id="home-search"
            type="search"
            name="query"
            class="px-3 sm:px-5 py-2 sm:py-3 text-zinc-700 bg-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:border-transparent grow"
            placeholder="Search items..."
            required
        />
        <button
            type="submit"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 sm:px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:border-transparent cursor-pointer"
            >Search</button
        >
    </form>
</div>
