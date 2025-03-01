<script lang="ts">
	import {
		isSidebarOpen,
		toggleSidebar,
		closeSidebar,
	} from "$lib/stores/sidebar";
	import Editor from "./Editor.svelte";
	import type { Note } from "$lib/types";

	var notes: Note[] = [
		{ id: "note-1", title: "State of Matter", content: "2025-02-28" },
		{ id: "note-2", title: "Morality and Ethics", content: "2025-02-28" },
	];
</script>

<div class="flex justify-between my-2 sm:hidden">
	<button
		data-drawer-target="default-sidebar"
		data-drawer-toggle="default-sidebar"
		aria-controls="default-sidebar"
		type="button"
		class="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
		on:click={toggleSidebar}
	>
		<span class="sr-only">Open sidebar</span>
		<svg
			class="w-6 h-6"
			aria-hidden="true"
			fill="currentColor"
			viewBox="0 0 20 20"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				clip-rule="evenodd"
				fill-rule="evenodd"
				d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
			></path>
		</svg>
	</button>
	<a href="/" class="flex items-center p-2">
		<img src="./favicon.png" class="w-8 h-8" alt="Noteman Logo" />
	</a>
</div>

<aside
	id="default-sidebar"
	class="fixed top-0 left-0 z-40 w-88 h-screen transition-transform duration-300 ease-in-out"
	class:translate-x-0={$isSidebarOpen}
	class:-translate-x-full={!$isSidebarOpen}
	aria-label="Sidebar"
>
	<div class="h-full px-3 py-4 overflow-y-auto bg-[#f9f9f9] dark:bg-gray-800">
		<div class="flex justify-between mb-5">
			<a href="/" class="flex items-center">
				<img
					src="./favicon.png"
					class="h-6 me-3 sm:h-7"
					alt="Noteman Logo"
				/>
				<span
					class="self-center text-xl font-semibold whitespace-nowrap dark:text-white"
					>Noteman</span
				>
			</a>
			<button
				class="inline-flex items-center text-sm p-2 text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
				aria-label="Close Sidebar"
				on:click={toggleSidebar}
			>
				<svg
					class="w-5 h-5"
					viewBox="0 0 24 24"
					fill="currentColor"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z"
					></path>
				</svg>
			</button>
		</div>
		<button
			type="button"
			aria-label="New Note"
			class="flex w-full items-center justify-center p-2 my-6 text-gray-900 rounded-lg bg-gray-100 shadow dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group"
		>
			<svg
				class="w-6 h-6 text-gray-700 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
				aria-hidden="true"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
				fill="currentColor"
			>
				<path
					d="M9 17a1 1 0 102 0v-6h6a1 1 0 100-2h-6V3a1 1 0 10-2 0v6H3a1 1 0 000 2h6v6z"
				></path>
			</svg>
		</button>

		<ul class="space-y-2 font-medium">
			{#each notes as note}
				<li>
					<a
						href="#{note.id}"
						class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
					>
						<span class="ms-3 truncate">{note.title}</span>
					</a>
				</li>
			{/each}
		</ul>
	</div>
</aside>

<div
	class="absolute left-0 z-20 overflow-hidden transition-shadow rounded-none shadow-[0_0px_18px_rgba(0,0,0,0.075)] opacity-100 will-change-auto w-full translate-x-0 h-full md:h-[1000px] md:w-[calc(100vw-400px)] md:translate-x-[400px]"
	on:click={closeSidebar}
>
	<div
		class="h-full overflow-hidden border-l border-gray-100 rounded-none will-change-auto"
	>
		<div class="h-full">
			<div
				class="absolute left-[-2px] z-10 h-full w-[4px] cursor-ew-resize opacity-0 select-none touch-pan-y"
				draggable="false"
			></div>
			<section class="flex h-full w-full flex-col">
				<Editor note={notes[0]} />
			</section>
		</div>
	</div>
</div>
