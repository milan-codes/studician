<script lang="ts">
	import { Separator } from '$lib/components/ui/separator';
	import type { PageData } from './$types';
	import EditCourseForm from './edit-course-form.svelte';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Edit {data.form.data.name}</title>
</svelte:head>

<div class="flex items-center justify-between">
	<div class="space-y-0.5">
		<h2 class="text-2xl font-bold tracking-tight">Edit course</h2>
		<p class="text-muted-foreground">Edit the selected course</p>
	</div>
</div>
<Separator class="my-4" />
<EditCourseForm {data} />
