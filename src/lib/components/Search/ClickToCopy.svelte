<script>
    import toast from "svelte-hot-french-toast"

    export let text = "";
    export let className = ""; // Accept a class name as a prop, if needed.
</script>

<button
    class={className}
    on:click={() => {
        navigator.clipboard
            .writeText(text)
            .then(() => {
                toast.success( `Copied "${text}" to your clipboard.`);
            })
            .catch((error) => {
                console.error("Failed to copy text: ", error);
                alert("Failed to copy text: ", error);
            });
    }}
>
    {text}
</button>
