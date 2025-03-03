<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { Editor } from "@tiptap/core";
	import StarterKit from "@tiptap/starter-kit";
	import Underline from "@tiptap/extension-underline";
	import BubbleMenu from "@tiptap/extension-bubble-menu";
	import Placeholder from "@tiptap/extension-placeholder";
	import Bubblemenu from "./Bubblemenu.svelte";

	export let content: string;
	let editor: Editor;
	let element: HTMLDivElement;

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
			content,
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
