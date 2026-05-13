<script>
    import { page } from "$app/state";
</script>

<div class="wa-stack wa-align-items-center">
    <wa-icon name="triangle-exclamation" class="wa-color-text-quiet wa-font-size-3xl"></wa-icon>
    <span class="wa-heading-l"
        >{"Error" + (page.status ? ` ${page.status}` : "")}</span
    >
    <p class="wa-caption-m">
        {page.error?.message || "An unexpected error occurred."}
    </p>
</div>
