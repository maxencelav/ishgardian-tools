<script>
    export let text = "";
    export let copyLabel = "Copy";
    export let successLabel = "Copied!";
    export let errorLabel = "Copy failed";
</script>

<wa-copy-button
    value={text}
    copy-label={copyLabel}
    success-label={successLabel}
    error-label={errorLabel}
>
    <wa-button appearance="plain" size="s">
        {text}
    </wa-button>
</wa-copy-button>
