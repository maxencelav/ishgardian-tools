<script>
    export let title;
    export let link;
    export let description;
</script>

<wa-card appearance="filled-outlined" style="width:100%;">
    <a href={link} target="_blank" rel="noopener noreferrer" style="text-decoration:none; color:inherit; display:block; padding:1rem;">
        <div class="wa-stack wa-gap-s">
            <span class="wa-heading-s">{title}</span>
            <span class="wa-body-s">{description}</span>
        </div>
    </a>
</wa-card>
