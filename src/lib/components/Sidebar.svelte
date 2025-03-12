<script lang="ts">
	import {
		isSidebarOpen,
		toggleSidebar,
		closeSidebar,
	} from "$lib/stores/sidebar";
	import Editor from "./Editor.svelte";
	import type { Note } from "$lib/models";
	import { onMount, tick } from "svelte";

	let notes: Note[] = $state([]);
	let selectedNote: Note | null = $state(null);

	let showModal: boolean = $state(false);
	let newNoteTitle: string = $state("");
	let inputRef: HTMLInputElement | null = $state(null);

	onMount(async () => {
		const response = await fetch("/api/notes");
		notes = await response.json();
		if (notes.length > 0) {
			selectedNote = notes[0];
		}
	});

	function selectNote(note: Note) {
		selectedNote = note;
	}

	async function createNote() {
		if (newNoteTitle.trim() === "") return;
		const newNote: Note = {
			title: newNoteTitle,
			content: "",
		};

		notes = [newNote, ...notes];
		const response = await fetch("/api/notes", {
			method: "POST",
			body: JSON.stringify(newNote),
		});
		console.log(response.ok);

		selectedNote = newNote;
		newNoteTitle = "";
		showModal = false;
	}

	async function deleteNote(note: Note) {
		notes = notes.filter((n) => n.id !== note.id);
		if (selectedNote && selectedNote.id === note.id) {
			selectedNote = notes.length > 0 ? notes[0] : null;
		}

		const response = await fetch(`/api/notes/${note.id}`, {
			method: "DELETE",
		});
		console.log(response.ok);
	}

	async function openModal() {
		showModal = true;
		await tick();
		inputRef?.focus();
	}
</script>

<div class="flex justify-between my-2 sm:hidden">
	<button
		data-drawer-target="default-sidebar"
		data-drawer-toggle="default-sidebar"
		aria-controls="default-sidebar"
		type="button"
		class="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
		onclick={toggleSidebar}
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
	class="fixed top-0 left-0 z-40 w-full md:w-88 md:translate-x-0 h-screen transition-transform duration-300 ease-in-out"
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
				onclick={toggleSidebar}
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
			data-modal-target="add-note-modal"
			data-modal-toggle="add-note-modal"
			aria-label="Add New Note"
			class="flex w-full items-center justify-center p-2 my-6 text-gray-900 rounded-lg bg-gray-100 shadow dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group"
			onclick={openModal}
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
				<li class="group flex items-center">
					<a
						href="#{note.id}"
						class="flex-1 flex items-center justify-between p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
						onclick={() => {
							selectNote(note);
							toggleSidebar();
						}}
					>
						<span class="ms-3 truncate">{note.title}</span>
						<button
							aria-label="Delete Note"
							class="invisible group-hover:visible text-red-500 mr-2"
							onclick={(e) => {
								e.stopPropagation();
								deleteNote(note);
							}}
						>
							<svg
								class="w-6 h-6 text-gray-700 hover:text-red-700 dark:text-gray-400"
								viewBox="0 0 24 24"
								fill="currentColor"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M6.99486 7.00636C6.60433 7.39689 6.60433 8.03005 6.99486 8.42058L10.58 12.0057L6.99486 15.5909C6.60433 15.9814 6.60433 16.6146 6.99486 17.0051C7.38538 17.3956 8.01855 17.3956 8.40907 17.0051L11.9942 13.4199L15.5794 17.0051C15.9699 17.3956 16.6031 17.3956 16.9936 17.0051C17.3841 16.6146 17.3841 15.9814 16.9936 15.5909L13.4084 12.0057L16.9936 8.42059C17.3841 8.03007 17.3841 7.3969 16.9936 7.00638C16.603 6.61585 15.9699 6.61585 15.5794 7.00638L11.9942 10.5915L8.40907 7.00636C8.01855 6.61584 7.38538 6.61584 6.99486 7.00636Z"
								></path>
							</svg>
						</button>
					</a>
				</li>
			{/each}
		</ul>
	</div>
</aside>

<div
	class="absolute left-0 z-20 overflow-hidden transition-shadow rounded-none shadow-[0_0px_18px_rgba(0,0,0,0.075)] opacity-100 will-change-auto w-full translate-x-0 h-full md:h-[1000px] md:w-[calc(100vw-400px)] md:translate-x-[400px]"
	onclick={closeSidebar}
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
				{#if selectedNote}
					<Editor note={selectedNote} />
				{/if}
			</section>
		</div>
	</div>
</div>

{#if showModal}
	<div
		id="add-note-modal"
		tabindex="-1"
		aria-hidden="true"
		class="fixed inset-0 flex items-center justify-center bg-black opacity-60 z-50"
	>
		<div class="bg-white p-4 rounded shadow z-60">
			<div class="flex items-center justify-between px-1 mb-2">
				<h2 class="text-xl mb-2">Create Note</h2>
				<button
					type="button"
					class="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
					data-modal-hide="new-note-modal"
					onclick={() => (showModal = false)}
				>
					<svg
						class="w-3 h-3"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 14 14"
					>
						<path
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
						/>
					</svg>
					<span class="sr-only">Close modal</span>
				</button>
			</div>
			<div
				class="m-0 flex h-10 w-fit min-w-0 flex-shrink items-center rounded-lg bg-gray-100 shadow-lg p-1"
			>
				<input
					type="text"
					bind:this={inputRef}
					bind:value={newNoteTitle}
					placeholder="Note Title"
					class="flex-1 bg-transparent outline-none text-sm px-2 w-64"
					onkeydown={(e) => {
						if (e.key === "Enter") {
							createNote();
						} else if (e.key === "Escape") {
							showModal = false;
						}
					}}
				/>
				<button
					type="button"
					class="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
					data-modal-hide="new-note-modal"
					onclick={createNote}
				>
					<svg
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						class="w-6 h-6"
						aria-hidden="true"
						viewBox="0 0 24 24"
					>
						<path
							d="M6 12H18M18 12L13 7M18 12L13 17"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						></path>
					</svg>
					<span class="sr-only">Create note</span>
				</button>
			</div>
		</div>
	</div>
{/if}
