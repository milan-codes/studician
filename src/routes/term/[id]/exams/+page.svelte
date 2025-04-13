<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
	import { Plus } from 'lucide-svelte';
	import type { PageProps } from './$types';
	import { cn } from '$lib/utils';
	import { Separator } from '$lib/components/ui/separator';
	import ExamCard from './exam-card.svelte';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Exams</title>
</svelte:head>

<div class="flex flex-col items-center justify-between gap-4 md:flex-row">
	<div class="space-y-0.5">
		<h2 class="text-2xl font-bold tracking-tight">Exams</h2>
		<p class="text-muted-foreground">You can find all the exams you have for this term here</p>
	</div>
	<a href={`/term/${data.activeTerm.id}/exams/new`} class={cn('w-full md:w-auto', buttonVariants())}
		><Plus /> Create new exam</a
	>
</div>
<Separator class="my-8" />
<div class="grid gap-4">
	{#each data.exams as exam}
		<ExamCard {exam} termId={data.activeTerm.id} />
	{/each}
</div>
