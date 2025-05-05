<script lang="ts">
	import { Separator } from '$lib/components/ui/separator';
	import type { PageData } from './$types';
	import DeleteActivityDialog from './delete-activity-dialog.svelte';
	import EditActivityForm from './edit-activity-form.svelte';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Edit {data.form.data.name}</title>
</svelte:head>

<div class="flex items-center justify-between">
	<div class="space-y-0.5">
		<h2 class="text-2xl font-bold tracking-tight">Edit activity</h2>
		<p class="text-muted-foreground">Edit the selected activity</p>
	</div>
</div>
<Separator class="my-4" />
<EditActivityForm {data} />
<Separator class="my-4" />
<DeleteActivityDialog />
