<script>
    import "../app.css";
</script>

<slot />

<style>
    :global(body) {
        background-image: url("/img/ishgard.jpg");
        background-size: cover;
        background-position: center;
        background-attachment: fixed;
    }
</style>