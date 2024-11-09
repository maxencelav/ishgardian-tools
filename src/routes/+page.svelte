<script>
    import HomeCard from '$lib/components/HomeCard.svelte';
</script>

<main class="bg-gradient-to-b from-blue-500 to-blue-900 dark:from-gray-800 dark:to-gray-900 min-h-screen flex items-center justify-center flex-col font-sans">
    <div class="max-w-2xl mx-auto p-4">
        <h1 class="text-white mb-2 font-thin text-6xl font-header tracking-tighter">Ishgardian Tools</h1>

  

    <input type="text" class="p-2 border rounded w-full bg-white dark:bg-gray-800 dark:text-white" placeholder="Search items..." />
        <p class="font-light text-white mt-4 mb-8 text-sm">
            This website is still in development! Feel free to answer our
            <a href="https://forms.gle/gLztQmJ3uw1xdL5XA" class="underline" target="_blank">survey</a> to help us improve the website. 🙏
        </p>

        <h2 class="text-4xl font-light text-white mb-4 font-header tracking-tighter">Other tools, in the meantime...</h2>
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
