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

	// Function to send updated content to your endpoint.
	function saveContent() {
		const updatedContent = editor.getHTML();
		fetch(`/api/notes/${note.id}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ content: updatedContent }),
		})
			.then((res) => {
				if (!res.ok) {
					throw new Error("Network response was not ok");
				}
				return res.json();
			})
			.then((data) => {
				console.log("Content saved successfully:", data);
			})
			.catch((error) => {
				console.error("Error saving content:", error);
			});
	}

	onMount(() => {
		editor = new Editor({
			// Attach the editor to the element
			element,
			extensions: [
				StarterKit,
				Underline,
				Placeholder.configure({
					placeholder: "Start typing...",
				}),
				BubbleMenu.configure({
					element: document.querySelector("#bubble-menu"),
					tippyOptions: {
						duration: 200,
						placement: "bottom",
					},
				}),
			],
			content: note.content,
			onUpdate: () => {
				clearTimeout(updateTimeout);
				updateTimeout = setTimeout(() => {
					saveContent();
				}, 5000);
			},
		});
	});

	onDestroy(() => {
		editor?.destroy();
	});
</script>

<!-- BubbleMenu -->
<Bubblemenu {editor} />
<!-- Toolbar -->
<!-- Toolbar {editor} />

<!-- Editor Content -->
<div bind:this={element} class="outline-none"></div>
