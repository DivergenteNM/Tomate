<script>
    import '../app.postcss';
    import { LightSwitch } from '@skeletonlabs/skeleton';

    // Floating UI for Popups
    import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
    import { storePopup } from '@skeletonlabs/skeleton';
    storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
</script>

<style>
    .header {
        background-color: var(--header-bg-color);
        color: var(--header-text-color);
        padding: 1rem;
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        width: 100%;
        top: 0;
        z-index: 1000;
        margin-bottom: 100px;
    }
    .mb-12 {
        margin-bottom: 3rem;
    }
    .header-txt {
        font-size: 1.2rem;
        font-weight: bold;
        display: flex;
        align-items: center;
    }
    .header-txt img {
        margin-left: 0.5rem; /* Espacio entre el texto y la imagen */
        width: 24px; /* Ajusta el tamaño de la imagen */
        height: 24px; /* Ajusta el tamaño de la imagen */
    }
</style>

<div class="header">
    <div class="header-txt">
        Manejo de cultivos de tomate en invernadero
        <img src="https://cdn-icons-png.flaticon.com/512/1202/1202125.png" alt="Tomato Icon" />
    </div>
    <LightSwitch />
</div>
<div class="mb-12"></div>

<slot />