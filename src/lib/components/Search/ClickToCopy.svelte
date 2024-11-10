<script>
    export let text = "";
    export let className = ""; // Accept a class name as a prop, if needed.
</script>

<button
    class={className}
    on:click={() => {
        navigator.clipboard
            .writeText(text)
            .then(() => {
                alert(`Copied "${text}" to your clipboard.`);
                // If you have a toast library, you could use it here instead of alert
                // toast.success(`Copied ${text} to your clipboard.`, {
                //   position: "bottom-left",
                //   autoClose: 2000,
                //   hideProgressBar: true,
                //   closeOnClick: true,
                //   pauseOnHover: true,
                //   draggable: true,
                // });
            })
            .catch((error) => {
                console.error("Failed to copy text: ", error);
            });
    }}
>
    {text}
</button>
