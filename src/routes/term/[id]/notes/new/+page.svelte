<script lang="ts">
	import { Separator } from '$lib/components/ui/separator';
	import type { PageData } from './$types';
	import AddNoteForm from './add-note-form.svelte';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>New note</title>
</svelte:head>

<div class="grid w-full gap-3">
	<div class="flex items-center justify-between">
		<div class="space-y-0.5">
			<h2 class="text-2xl font-bold tracking-tight">Create new note</h2>
			<p class="text-muted-foreground">Create a new note for one of your classes from this term</p>
		</div>
	</div>
	<Separator class="my-4" orientation="horizontal" />
	<AddNoteForm {data} />
</div>
