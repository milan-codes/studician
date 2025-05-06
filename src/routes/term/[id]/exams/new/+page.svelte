<script lang="ts">
	import { Separator } from '$lib/components/ui/separator';
	import type { PageData } from './$types';
	import AddExamForm from './add-exam-form.svelte';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>New exam</title>
</svelte:head>

<div class="flex items-center justify-between">
	<div class="space-y-0.5">
		<h2 class="text-2xl font-bold tracking-tight">Create new exam</h2>
		<p class="text-muted-foreground">Set up an exam for this term</p>
	</div>
</div>
<Separator class="my-4" />
<AddExamForm {data} />
