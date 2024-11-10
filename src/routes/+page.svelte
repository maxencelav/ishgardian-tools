<script>
    import HomeCard from "$lib/components/HomeCard.svelte";
</script>

<main
    class="min-h-screen flex items-center justify-center flex-col font-sans backdrop-filter backdrop-blur-lg bg-black/50 dark:bg-black/80 dark:text-white"
>
    <div class="max-w-2xl mx-auto p-4">
        <h1
            class="text-white mb-2 font-thin text-6xl font-header tracking-tighter"
        >
            Ishgardian Tools
        </h1>

        <form action="/search" method="get" class="flex justify-center w-full">
            <input
                type="text"
                name="query"
                class="px-5 py-3 text-zinc-700 bg-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:border-transparent grow"
                placeholder="Search items..."
            />
            <button
                type="submit"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg ml-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:border-transparent"
                >Search</button
            >
        </form>

        <p class="font-light text-white mt-4 mb-8 text-sm">
            This website is still in development! Feel free to answer our
            <a
                href="https://forms.gle/gLztQmJ3uw1xdL5XA"
                class="underline"
                target="_blank">survey</a
            > to help us improve the website. 🙏
        </p>

        <h2
            class="text-4xl font-light text-white mb-4 font-header tracking-tighter"
        >
            Other tools, in the meantime...
        </h2>
        <div class="flex flex-col md:flex-row justify-center flex-wrap gap-4">
            <HomeCard
                title="Moogle Search"
                link="https://old.ishgardian.tools/"
                description="Check out the origins of this website."
            />

            <HomeCard
                title="Garland Tools"
                link="https://garlandtools.org/"
                description="The original FFXIV database website."
            />

            <HomeCard
                title="Source code"
                link="https://github.com/maxencelav/ishgardian-tools"
                description="Go behind the scenes and see the source code."
            />
        </div>
    </div>
</main>
