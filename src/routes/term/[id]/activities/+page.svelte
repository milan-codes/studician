<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { Plus } from 'lucide-svelte';
	import type { PageProps } from '../activities/$types';
	import { cn } from '$lib/utils';

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
