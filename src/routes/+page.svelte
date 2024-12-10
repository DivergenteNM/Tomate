<script>
	import { onMount } from 'svelte';
	import { Prolog } from '$lib';
	import { Autocomplete, popup } from '@skeletonlabs/skeleton';
	import { Trash, Send, Moon, Sun } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';
	import Message from './(components)/Message.svelte';

	const prologo = new Prolog();

	let registroChat = [];
	let respuesta = '';
	let ocupado = false;
	let respuestas = [];
	let darkMode = true;

	const mostrarPregunta = (pregunta) => {
		registroChat = [
			...registroChat,
			{
				modo: 'sistema_pregunta',
				mensaje: pregunta
			}
		];
	};

	const mostrarRespuesta = (respuesta) => {
		respuestas = respuesta.map((r) => ({
			modo: 'sistema_respuesta',
			mensaje: r
		}));
		registroChat = [...registroChat, ...respuestas];
	};

	const scrollBottom = () => {
		window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
	};

	const componerRespuestas = (respuestasArr) => {
		respuesta = '';
		respuestas = respuestasArr.map((r) => ({
			label: r,
			value: r
		}));
	};

	const parseInput = async (entrada) => {
		switch (entrada[0]) {
			case 'PREGUNTA':
				mostrarPregunta(entrada[1]);
				componerRespuestas(entrada.slice(2));
				break;
			case 'RESPUESTA':
				mostrarRespuesta(entrada.slice(1));
				await new Promise((r) => setTimeout(r, 50));
				scrollBottom();
				const resultado = await prologo.esperarRespuesta();
				await parseInput(resultado);
			default:
				break;
		}
	};

	const nuevaSesion = async () => {
		ocupado = true;
		registroChat = [];
		prologo.nuevaSesion();
		const resultado = await prologo.esperarRespuesta();
		await parseInput(resultado);
		ocupado = false;
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const enviarRespuesta = async () => {
		if (respuesta.trim() === '') return;
		ocupado = true;
		registroChat = [
			...registroChat,
			{
				modo: 'usuario',
				mensaje: respuesta
			}
		];
		await new Promise((r) => setTimeout(r, 50));
		scrollBottom();
		const resultado = await prologo.enviarRespuesta(respuesta);
		respuesta = '';
		await parseInput(resultado);
		scrollBottom();
		ocupado = false;
	};

	onMount(nuevaSesion);

	let popupSettings = {
		event: 'focus-click',
		target: 'popupAutocomplete',
		placement: 'top'
	};

	function onPopupDemoSelect(event) {
		respuesta = event.detail.label;
	}

	function toggleDarkMode() {
		darkMode = !darkMode;
				if (darkMode) {
			document.documentElement.classList.add('dark');
			document.documentElement.style.setProperty('--header-bg-color', '#1a1a1a'); // Color mate oscuro
			document.documentElement.style.setProperty('--header-text-color', '#e0e0e0'); // Color mate claro
		} else {
			document.documentElement.classList.remove('dark'); 
			document.documentElement.style.setProperty('--header-bg-color', '#949494'); // Color mate claro
			document.documentElement.style.setProperty('--header-text-color', '#1a1a1a'); // Color mate oscuro
		}
	}
</script>

<div class={`chat-container min-h-screen pb-32 ${darkMode ? 'dark bg-gray-800' : 'bg-gray-50'}`}>
		<div class="max-w-4xl mx-auto px-4 pt-8 space-y-6">
		{#each registroChat as registro}
			<div class="text-4xl" in:fly="{{ y: 20, duration: 800 }}" out:fade="{{ duration: 600 }}">
				<Message modo={registro.modo} {darkMode}>
					{registro.mensaje}
				</Message>
			</div>
		{/each}
		{#if ocupado}
			<div class="flex justify-center items-center py-4" in:fade="{{ duration: 600 }}">
				<div class="loader"></div>
			</div>
		{/if}
	</div>
</div>

<div class={`fixed left-0 bottom-0 w-full ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-t px-4 py-4 md:py-6`}>
	<div class="max-w-4xl mx-auto">
		<div class={`flex items-center rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500`}>
			<input
				class={`flex-grow px-4 py-2 bg-transparent outline-none ${darkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'}`}
				type="text"
				placeholder="Type your message..."
				disabled={ocupado}
				bind:value={respuesta}
				on:keydown={(e) => e.key === 'Enter' && !e.shiftKey && enviarRespuesta()}
				use:popup={popupSettings}
			/>
			<button
				class={`p-2 ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'} focus:outline-none`}
				disabled={ocupado}
				on:click={enviarRespuesta}
			>
				<Send size={20} />
			</button>
			<button
				class={`p-2 ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'} focus:outline-none`}
				disabled={ocupado}
				on:click={nuevaSesion}
			>
				<Trash size={20} />
			</button>
			<button
				class={`p-2 ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'} focus:outline-none`}
				on:click={toggleDarkMode}
			>
				{#if darkMode}
					<Sun size={20} />
				{:else}
					<Moon size={20} />
				{/if}
			</button>
		</div>
	</div>
</div>

<div data-popup="popupAutocomplete" class="w-full">
	<div class="max-w-4xl mx-auto">
		<div class={`card p-2 mr-4 space-y-2 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg`}>
			<Autocomplete
				bind:input={respuesta}
				options={respuestas}
				emptyState="No se encontraron resultados"
				on:selection={onPopupDemoSelect}
				on:click={enviarRespuesta}
			/>
		</div>
	</div>
</div>

<style>
	:global(:root) {
        --header-bg-color: #000;
        --header-text-color: #fff;
    }
	
	:global(body) {
		transition: background-color 0.3s ease, color 0.3s ease;
	}

	:global(body.dark) {
		background-color: #1f2937;
		color: #f3f4f6;
	}

	.chat-container {
		display: flex;
		flex-direction: column;
		transition: background-color 0.3s ease;
	}

	.loader {
		border: 3px solid #f3f3f3;
		border-top: 3px solid #3498db;
		border-radius: 50%;
		width: 24px;
		height: 24px;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}

	:global(.message) {
		padding: 1rem;
		margin-bottom: 2rem; /* Increased from 1rem to 2rem */
		border-radius: 0.5rem;
		line-height: 1.5;
		transition: background-color 0.3s ease, color 0.3s ease;
	}

	:global(.dark .message.sistema_pregunta) {
		background-color: #374151;
		color: #e5e7eb;
	}

	:global(.dark .message.sistema_respuesta) {
		background-color: #1e3a8a;
		color: #e5e7eb;
	}

	:global(.dark .message.usuario) {
		background-color: #4b5563;
		color: #e5e7eb;
		text-align: right;
	}

	:global(.message.sistema_pregunta) {
		background-color: #e5e7eb;
	}

	:global(.message.sistema_respuesta) {
		background-color: #dbeafe;
	}

	:global(.message.usuario) {
		background-color: #f3f4f6;
		text-align: right;
	}
</style>

