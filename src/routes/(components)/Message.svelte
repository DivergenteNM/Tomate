<script>
	import { fly } from 'svelte/transition';

	export let modo = 'usuario';
	let color = '';
	let margin = '';
	let titulo = '';
	let border = '';
	let ubicacion = '';
	let flyThing = 1;
	switch (modo) {
		case 'usuario':
			color = 'variant-ghost-secondary';
			margin = 'ml-12';
			titulo = 'Respuesta: ';
			border = 'rounded-tr-none';
			ubicacion = 'justify-end';
			flyThing = 1;
			break;
		case 'sistema_pregunta':
			color = 'variant-ghost-tertiary';
			margin = 'mr-12';
			titulo = 'Pregunta de parte del sistema: ';
			border = 'rounded-tl-none';
			ubicacion = 'justify-start';
			flyThing = -1;
			break;

		case 'sistema_respuesta':
			color = 'variant-ghost-primary';
			margin = 'mr-12';
			titulo = 'Respuesta ofrecida por el sistema: ';
			border = 'rounded-tl-none';
			ubicacion = 'justify-start';
			flyThing = -1;
			break;

		default:
			break;
	}
</script>

<div
	class="flex {ubicacion}"
	in:fly={{ x: 200 * flyThing, duration: 500 }}
	out:fly={{ x: 200 * flyThing, duration: 500 }}
>
	<div
		class="card flex flex-col w-full max-w-lg {margin} leading-1.5 p-4 border-gray-200 {border} rounded-xl {color}"
	>
		<div class="flex items-center space-x-2 rtl:space-x-reverse">
			<span class="text-sm font-semibold text-gray-900 dark:text-white">{titulo}</span>
		</div>
		<p class="text-sm font-normal py-2.5 text-gray-900 dark:text-white">
			<slot></slot>
		</p>
	</div>
</div>
