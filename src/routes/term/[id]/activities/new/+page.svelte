<script lang="ts">
	import { Separator } from '$lib/components/ui/separator';
	import type { PageData } from './$types';
	import AddActivityForm from './add-activity-form.svelte';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>New activity</title>
</svelte:head>

<div class="flex items-center justify-between">
	<div class="space-y-0.5">
		<h2 class="text-2xl font-bold tracking-tight">Create new activity</h2>
		<p class="text-muted-foreground">Set up an activity for this term</p>
	</div>
</div>
<Separator class="my-4" />
<AddActivityForm {data} />
