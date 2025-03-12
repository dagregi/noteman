<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { Editor } from "@tiptap/core";
	import StarterKit from "@tiptap/starter-kit";
	import Underline from "@tiptap/extension-underline";
	import BubbleMenu from "@tiptap/extension-bubble-menu";
	import Placeholder from "@tiptap/extension-placeholder";
	import Bubblemenu from "./Bubblemenu.svelte";
	import type { Note } from "$lib/models";

	export let note: Note;
	let editor: Editor;
	let element: HTMLDivElement;
	let updateTimeout: ReturnType<typeof setTimeout>;

	async function saveContent() {
		try {
			const updatedContent = editor.getHTML();
			const res = await fetch(`/api/notes/${note.id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ content: updatedContent }),
			});
			if (!res.ok) {
				throw new Error("Network response was not ok");
			}
			const data = await res.json();
			console.log("Content saved successfully:", data);
		} catch (error) {
			console.error("Error saving content:", error);
		}
	}

	onMount(() => {
		const bubbleMenuEl = document.querySelector("#bubble-menu");

		editor = new Editor({
			element,
			extensions: [
				StarterKit,
				Underline,
				Placeholder.configure({
					placeholder: "Start typing...",
				}),
				BubbleMenu.configure({
					element: bubbleMenuEl,
					tippyOptions: {
						duration: 200,
						placement: "bottom",
					},
				}),
			],
			content: note.content,
			onUpdate: () => {
				// Debounce the save operation to avoid too many network calls.
				clearTimeout(updateTimeout);
				updateTimeout = setTimeout(() => {
					saveContent();
				}, 3000);
			},
		});
	});

	onDestroy(() => {
		editor?.destroy();
	});
</script>

<!-- BubbleMenu -->
<Bubblemenu {editor} />

<!-- Editor Content -->
<div bind:this={element} class="outline-none"></div>
