<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { Plus } from 'lucide-svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<div class="flex items-center justify-between">
	<div class="space-y-0.5">
		<h2 class="text-2xl font-bold tracking-tight">Courses</h2>
		<p class="text-muted-foreground">You can find all the courses you have for this term here</p>
	</div>
	<a href={`/term/${data.activeTerm.id}/courses/new`} class={buttonVariants()}
		><Plus /> Create new course</a
	>
</div>
<Separator class="my-8" />
