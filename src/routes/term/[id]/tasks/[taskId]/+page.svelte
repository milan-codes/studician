<script lang="ts">
	import { Separator } from '$lib/components/ui/separator';
	import type { PageData } from './$types';
	import DeleteTaskDialog from './delete-task-dialog.svelte';
	import EditTaskForm from './edit-task-form.svelte';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Edit {data.form.data.name}</title>
</svelte:head>

<div class="flex items-center justify-between">
	<div class="space-y-0.5">
		<h2 class="text-2xl font-bold tracking-tight">Edit task</h2>
		<p class="text-muted-foreground">Edit the selected task</p>
	</div>
</div>
<Separator class="my-4" />
<EditTaskForm {data} />
<Separator class="my-4" />
<DeleteTaskDialog />
