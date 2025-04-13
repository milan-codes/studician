<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
	import { Plus } from 'lucide-svelte';
	import type { PageProps } from './$types';
	import { cn } from '$lib/utils';
	import { Separator } from '$lib/components/ui/separator';
	import NoteCard from './note-card.svelte';
	import Clumsy from '$lib/illustrations/clumsy.svg';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Notes</title>
</svelte:head>

<div class="flex flex-col items-center justify-between gap-4 md:flex-row">
	<div class="space-y-0.5">
		<h2 class="text-2xl font-bold tracking-tight">Notes</h2>
		<p class="text-muted-foreground">You can find all the notes you have for this term here</p>
	</div>
	<a href={`/term/${data.activeTerm.id}/notes/new`} class={cn('w-full md:w-auto', buttonVariants())}
		><Plus /> Create new note</a
	>
</div>
<Separator class="my-8" />
{#if data.notes.length}
	<div class="grid gap-4">
		{#each data.notes as note}
			<NoteCard {note} termId={data.activeTerm.id} />
		{/each}
	</div>
{:else}
	<div class="my-4 flex h-full w-full flex-col items-center justify-center gap-4 md:gap-16">
		<div class="w-9/12 md:w-1/3">
			<img src={Clumsy} alt="Illustration of a person slipping and throwing their papers" />
		</div>
		<p class="text-center">It looks like you don't have any notes. Create a new one!</p>
	</div>
{/if}
