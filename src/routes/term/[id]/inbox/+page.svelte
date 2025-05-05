<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { Check, Plus } from 'lucide-svelte';
	import type { PageProps } from './$types';
	import NotificationCard from './notification-card.svelte';
	import Plant from '$lib/illustrations/plant.svg';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Inbox</title>
</svelte:head>

<div class="flex flex-col items-center justify-between gap-4 md:flex-row">
	<div class="space-y-0.5">
		<h2 class="text-2xl font-bold tracking-tight">Inbox</h2>
		<p class="text-muted-foreground">
			You can find all the notifications you have for this term here
		</p>
	</div>
	<form method="POST">
		<Button type="submit" class="w-full md:w-auto" disabled={!data.notifications.length}
			><Check /> Mark all as read</Button
		>
	</form>
</div>
<Separator class="my-8" />
{#if data.notifications.length}
	{#each data.notifications as notification}
		<NotificationCard {notification} termId={data.activeTerm.id} />
	{/each}
{:else}
	<div class="my-4 flex h-full w-full flex-col items-center justify-center gap-4 md:gap-16">
		<div class="w-9/12 md:w-1/3">
			<img src={Plant} alt="Illustration of a person holding a plant" />
		</div>
		<p class="text-center">It looks like your inbox is empty. Take a break!</p>
	</div>
{/if}
