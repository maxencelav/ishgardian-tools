<script>
    import "../app.css";
    import Navbar from "$lib/components/Navbar.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import { Toaster } from "svelte-hot-french-toast";
</script>

<Toaster />
<div class="flex flex-col min-h-dvh">
    <Navbar />
    <main class="flex-1 flex flex-col">
        <slot />
    </main>
    <Footer />
</div>