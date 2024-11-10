<script>
    export let title;
    export let link;
    export let description;
</script>

<a
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    class="bg-white rounded-lg shadow-md p-4 mb-4 block basis-0 grow hover:shadow-lg hover:translate-y-0.5 transition-transform text-black dark:bg-zinc-800 dark:text-zinc-200"
>
    <h2 class="text-xl mb-2 font-medium tracking-tighter">{title}</h2>
    <p>{description}</p>
</a>
