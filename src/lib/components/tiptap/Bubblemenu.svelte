<script lang="ts">
	import type { Editor } from "@tiptap/core";
	import { tick } from "svelte";

	let { editor }: { editor: Editor } = $props();

	let showPrompt = $state(false);
	let prompt = $state("");
	let result = $state("");
	let loading = $state(false);
	let error = $state("");

	let inputRef: HTMLInputElement | null = $state(null);

	async function openPrompt() {
		showPrompt = true;
		// Wait for the DOM to update before focusing the input.
		await tick();
		inputRef?.focus();
	}

	async function handleSubmit() {
		if (prompt.trim() === "") return;
		loading = true;
		error = "";

		const { from, to } = editor.state.selection;
		const selectedText = editor.state.doc.textBetween(from, to, " ");

		try {
			const response = await fetch("/api/llm", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					prompt: prompt,
					text: selectedText,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				if (response.status == 503) {
					error = "Please check your internet connection.";
				} else if (response.status == 500) {
					error = "Server encontered an error.";
				} else {
					error =
						errorData.error?.message ||
						`Server responded with status: ${response.status}`;
				}
				throw new Error(error);
			}

			const data = await response.json();
			result = data.body.result;

			editor
				.chain()
				.focus()
				.deleteRange({ from, to })
				.insertContent(result)
				.run();

			// Reset state.
			prompt = "";
			showPrompt = false;
		} catch (e: any) {
			error = e.message || "An unexpected error occurred.";
		} finally {
			loading = false;
		}
	}

	function cancelPrompt() {
		prompt = "";
		showPrompt = false;
	}
</script>

{#if showPrompt}
	<div
		id="bubble-menu"
		class="m-0 flex h-10 w-fit min-w-0 flex-shrink items-center rounded-xl bg-gray-100 shadow-lg p-1"
	>
		<input
			bind:this={inputRef}
			type="text"
			bind:value={prompt}
			placeholder="Enter your prompt..."
			class="flex-1 bg-transparent outline-none text-sm px-2"
			onkeydown={(e) => {
				if (e.key === "Enter" && !loading) {
					handleSubmit();
				} else if (e.key === "Escape") {
					cancelPrompt();
				}
			}}
			disabled={loading}
		/>
		{#if loading}
			<svg
				class="animate-spin h-5 w-5 text-gray-500"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
			>
				<circle
					class="opacity-25"
					cx="12"
					cy="12"
					r="10"
					stroke="currentColor"
					stroke-width="4"
				></circle>
				<path
					class="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
				></path>
			</svg>
		{/if}
	</div>
	{#if error}
		<p class="text-red-500 text-xs mt-1">{error}</p>
	{/if}
{:else}
	<div
		id="bubble-menu"
		class="m-0 flex h-10 w-fit min-w-0 flex-shrink items-center rounded-xl bg-gray-100 shadow-lg p-1"
	>
		<button
			onclick={openPrompt}
			class="flex h-full items-center gap-1 rounded-lg px-2.5 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed dark:hover:bg-token-main-surface-secondary disabled:hover:bg-transparent"
		>
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				class="icon-sm mr-0.5 text-token-text-tertiary"
			>
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M12 4.5C7.5271 4.5 4 7.91095 4 12C4 13.6958 4.5996 15.263 5.62036 16.5254C5.80473 16.7534 5.87973 17.0509 5.82551 17.339C5.72928 17.8505 5.60336 18.3503 5.45668 18.8401C6.08722 18.743 6.69878 18.6098 7.2983 18.4395C7.54758 18.3687 7.81461 18.3975 8.04312 18.5197C9.20727 19.1423 10.5566 19.5 12 19.5C16.4729 19.5 20 16.0891 20 12C20 7.91095 16.4729 4.5 12 4.5ZM2 12C2 6.70021 6.53177 2.5 12 2.5C17.4682 2.5 22 6.70021 22 12C22 17.2998 17.4682 21.5 12 21.5C10.3694 21.5 8.82593 21.1286 7.46141 20.4675C6.36717 20.7507 5.2423 20.9253 4.06155 20.9981C3.72191 21.019 3.39493 20.8658 3.19366 20.5915C2.9924 20.3171 2.94448 19.9592 3.06647 19.6415C3.35663 18.8859 3.6004 18.1448 3.77047 17.399C2.65693 15.8695 2 14.0088 2 12ZM12 8C12.5523 8 13 8.44772 13 9V11H15C15.5523 11 16 11.4477 16 12C16 12.5523 15.5523 13 15 13H13V15C13 15.5523 12.5523 16 12 16C11.4477 16 11 15.5523 11 15V13H9C8.44772 13 8 12.5523 8 12C8 11.4477 8.44772 11 9 11H11V9C11 8.44772 11.4477 8 12 8Z"
					fill="currentColor"
				></path>
			</svg>
			<span class="truncate text-sm text-token-text-primary">Ask AI</span>
		</button>
		<div
			data-orientation="vertical"
			aria-orientation="vertical"
			role="separator"
			class="mx-1 p-0 list-none h-full w-[1px] bg-gray-300"
		></div>
		<button
			onclick={() => editor.chain().focus().toggleBold().run()}
			class="flex h-full items-center gap-1 rounded-lg px-2.5 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed dark:hover:bg-token-main-surface-secondary disabled:hover:bg-transparent"
			aria-label="Bold"
		>
			<strong>B</strong>
		</button>
		<button
			onclick={() => editor.chain().focus().toggleItalic().run()}
			class="flex h-full items-center gap-1 rounded-lg px-2.5 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed dark:hover:bg-token-main-surface-secondary disabled:hover:bg-transparent"
			aria-label="Italic"
		>
			<em>I</em>
		</button>
		<button
			onclick={() => editor.chain().focus().toggleStrike().run()}
			class="flex h-full items-center gap-1 rounded-lg px-2.5 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed dark:hover:bg-token-main-surface-secondary disabled:hover:bg-transparent"
			aria-label="Strikethrough"
		>
			<s>S</s>
		</button>
	</div>
{/if}
