<script lang="ts">
	import { Separator } from '$lib/components/ui/separator';
	import type { PageData } from './$types';
	import EditExamForm from './edit-exam-form.svelte';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Edit {data.form.data.name}</title>
</svelte:head>

<div class="flex items-center justify-between">
	<div class="space-y-0.5">
		<h2 class="text-2xl font-bold tracking-tight">Edit exam</h2>
		<p class="text-muted-foreground">Edit the selected exam</p>
	</div>
</div>
<Separator class="my-4" />
<EditExamForm {data} />
