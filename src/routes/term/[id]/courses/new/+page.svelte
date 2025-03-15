<script lang="ts">
	import { Separator } from '$lib/components/ui/separator';
	import type { PageData } from './$types';
	import AddCourseForm from './add-course-form.svelte';

	let { data }: { data: PageData } = $props();
</script>

<div class="flex items-center justify-between">
	<div class="space-y-0.5">
		<h2 class="text-2xl font-bold tracking-tight">Create new course</h2>
		<p class="text-muted-foreground">Set up a course for this term</p>
	</div>
</div>
<Separator class="my-4" />
<AddCourseForm {data} />
