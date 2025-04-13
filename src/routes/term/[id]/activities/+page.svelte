<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { Plus } from 'lucide-svelte';
	import type { PageProps } from '../activities/$types';
	import ActivityCard from './new/activity-card.svelte';
	import { cn } from '$lib/utils';
	import RollerSkating from '$lib/illustrations/roller-skating.svg';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Activities</title>
</svelte:head>

<div class="flex flex-col items-center justify-between gap-4 md:flex-row">
	<div class="space-y-0.5">
		<h2 class="text-2xl font-bold tracking-tight">Activities</h2>
		<p class="text-muted-foreground">You can find all the activities you have for this term here</p>
	</div>
	<a
		href={`/term/${data.activeTerm.id}/activities/new`}
		class={cn('w-full md:w-auto', buttonVariants())}><Plus /> Create new activity</a
	>
</div>
<Separator class="my-8" />
{#if data.activities.length}
	<div class="grid gap-4">
		{#each data.activities as activity}
			<ActivityCard {activity} />
		{/each}
	</div>
{:else}
	<div class="my-4 flex h-full w-full flex-col items-center justify-center gap-4 md:gap-16">
		<div class="w-9/12 md:w-1/3">
			<img src={RollerSkating} alt="Illustration of a person roller skating" />
		</div>
		<p class="text-center">It looks like you don't have any activities. Create a new one!</p>
	</div>
{/if}
