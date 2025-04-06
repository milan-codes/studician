<script lang="ts">
	import { Separator } from '$lib/components/ui/separator';
	import { Toggle } from '$lib/components/ui/toggle';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import {
		Bold,
		CodeXml,
		Heading1,
		Heading2,
		Heading3,
		Italic,
		List,
		ListOrdered,
		Quote,
		Strikethrough
	} from 'lucide-svelte';
	import { onDestroy } from 'svelte';

	let editor: Editor | null = $state(null);
	let element: HTMLElement;

	let isActive = $state({
		h1: false,
		h2: false,
		h3: false,
		bold: false,
		italic: false,
		strike: false,
		codeBlock: false,
		blockquote: false,
		orderedList: false,
		bulletList: false
	});
	let { value = $bindable() }: { value: string } = $props();

	$effect(() => {
		if (editor) return;
		editor = new Editor({
			element,
			extensions: [StarterKit],
			content: value,
			editorProps: {
				attributes: {
					class:
						'prose prose-sm sm:prose-sm md:prose-md max-w-none mt-8 focus:outline-none min-h-[500px] outline-none'
				}
			},
			onTransaction: () => {
				if (editor)
					isActive = {
						h1: editor.isActive('heading', { level: 1 }),
						h2: editor.isActive('heading', { level: 2 }),
						h3: editor.isActive('heading', { level: 3 }),
						bold: editor.isActive('bold'),
						italic: editor.isActive('italic'),
						strike: editor.isActive('strike'),
						codeBlock: editor.isActive('codeBlock'),
						blockquote: editor.isActive('blockquote'),
						orderedList: editor.isActive('orderedList'),
						bulletList: editor.isActive('bulletList')
					};
			},
			onUpdate: ({ editor }) => {
				value = editor.getHTML();
			}
		});
	});

	onDestroy(() => {
		editor?.destroy();
	});
</script>

{#if editor}
	<div class="flex flex-row gap-2">
		<Toggle
			pressed={isActive.h1}
			onPressedChange={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
			><Heading1 /></Toggle
		>
		<Toggle
			pressed={isActive.h2}
			onPressedChange={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
			><Heading2 /></Toggle
		>
		<Toggle
			pressed={isActive.h3}
			onPressedChange={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
			><Heading3 /></Toggle
		>
		<Separator orientation="vertical" class="mx-2" />
		<Toggle
			pressed={isActive.bold}
			onPressedChange={() => editor?.chain().focus().toggleBold().run()}><Bold /></Toggle
		>
		<Toggle
			pressed={isActive.italic}
			onPressedChange={() => editor?.chain().focus().toggleItalic().run()}
		>
			<Italic />
		</Toggle>
		<Toggle
			pressed={isActive.strike}
			onPressedChange={() => editor?.chain().focus().toggleStrike().run()}><Strikethrough /></Toggle
		>
		<Separator orientation="vertical" class="mx-2" />
		<Toggle
			pressed={isActive.codeBlock}
			onPressedChange={() => editor?.chain().focus().toggleCodeBlock().run()}
			><CodeXml />
		</Toggle>
		<Separator orientation="vertical" class="mx-2" />
		<Toggle
			pressed={isActive.blockquote}
			onPressedChange={() => editor?.chain().focus().toggleBlockquote().run()}><Quote /></Toggle
		>
		<Separator orientation="vertical" class="mx-2" />
		<Toggle
			pressed={isActive.orderedList}
			onPressedChange={() => editor?.chain().focus().toggleOrderedList().run()}
			><ListOrdered /></Toggle
		>
		<Toggle
			pressed={isActive.bulletList}
			onPressedChange={() => editor?.chain().focus().toggleBulletList().run()}><List /></Toggle
		>
	</div>
{/if}
<div bind:this={element}></div>
