<script lang="ts">
	import { Separator } from '$lib/components/ui/separator';
	import type { PageData } from './$types';
	import AddTaskForm from './add-task-form.svelte';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>New task</title>
</svelte:head>

<div class="flex items-center justify-between">
	<div class="space-y-0.5">
		<h2 class="text-2xl font-bold tracking-tight">Create new task</h2>
		<p class="text-muted-foreground">Set up a task for this term</p>
	</div>
</div>
<Separator class="my-4" />
<AddTaskForm {data} />
