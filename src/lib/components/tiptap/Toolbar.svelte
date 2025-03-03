<script lang="ts">
	import type { Editor } from "@tiptap/core";
	import type { Level } from "@tiptap/extension-heading";

	export let editor: Editor;

	// Helper function for headings (if you want to pass a level dynamically)
	function setHeading(level: Level) {
		editor.chain().focus().toggleHeading({ level }).run();
	}
</script>

<div class="toolbar flex gap-2 mb-2">
	<button
		on:click={() => editor.chain().focus().toggleBold().run()}
		class:active={editor?.isActive("bold")}
		aria-label="Bold"
		type="button"
		class="p-2 border rounded"
	>
		B
	</button>
	<button
		on:click={() => editor.chain().focus().toggleItalic().run()}
		class:active={editor?.isActive("italic")}
		aria-label="Italic"
		type="button"
		class="p-2 border rounded"
	>
		I
	</button>
	<button
		on:click={() => editor.chain().focus().toggleStrike().run()}
		class:active={editor?.isActive("strike")}
		aria-label="Strike"
		type="button"
		class="p-2 border rounded"
	>
		S
	</button>
	<button
		on:click={() => editor.chain().focus().toggleUnderline().run()}
		class:active={editor?.isActive("underline")}
		aria-label="Underline"
		type="button"
		class="p-2 border rounded"
	>
		U
	</button>
	<button
		on:click={() => setHeading(1)}
		class:active={editor?.isActive("heading", { level: 1 })}
		aria-label="Heading 1"
		type="button"
		class="p-2 border rounded"
	>
		H1
	</button>
	<button
		on:click={() => setHeading(2)}
		class:active={editor?.isActive("heading", { level: 2 })}
		aria-label="Heading 2"
		type="button"
		class="p-2 border rounded"
	>
		H2
	</button>
	<button
		on:click={() => editor.chain().focus().toggleBulletList().run()}
		class:active={editor?.isActive("bulletList")}
		aria-label="Bullet List"
		type="button"
		class="p-2 border rounded"
	>
		• List
	</button>
	<button
		on:click={() => editor.chain().focus().toggleOrderedList().run()}
		class:active={editor?.isActive("orderedList")}
		aria-label="Ordered List"
		type="button"
		class="p-2 border rounded"
	>
		1. List
	</button>
</div>
