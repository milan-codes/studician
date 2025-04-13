<script lang="ts">
	import { Separator } from '$lib/components/ui/separator';
	import type { PageProps } from './$types';
	import SummaryClassCard from './summary-class-card.svelte';
	import SummaryExamCard from './summary-exam-card.svelte';
	import SummaryTaskCard from './summary-task-card.svelte';
	import Chilling from '$lib/illustrations/chilling.svg';

	let { data }: PageProps = $props();

	let isOffday = $derived(
		!data.schedule.classes.length && !data.schedule.exams.length && !data.schedule.tasks.length
	);
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<div class="space-y-0.5">
	<h2 class="text-2xl font-bold tracking-tight">
		Welcome,
		{#if data.user.name}
			{data.user.name}
		{:else}
			{data.user.username}
		{/if}!
	</h2>
	<p class="text-muted-foreground">Here's a quick summary of your day</p>
</div>
<Separator class="my-8" />
<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
	<SummaryClassCard courseClasses={data.schedule.classes} />
	<SummaryTaskCard tasks={data.schedule.tasks} />
	<SummaryExamCard exams={data.schedule.exams} />
</div>
{#if isOffday}
	<div class="my-4 flex h-full w-full flex-col items-center justify-center gap-4 md:gap-16">
		<div class="w-9/12 md:w-1/3">
			<img src={Chilling} alt="Illustration of someone resting" />
		</div>
		<p class="text-center">
			It looks like you don't have anything planned for today. Enjoy your rest!
		</p>
	</div>
{/if}
