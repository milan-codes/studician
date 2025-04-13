<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { Plus } from 'lucide-svelte';
	import type { PageProps } from './$types';
	import CourseCard from './course-card.svelte';
	import { cn } from '$lib/utils';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Courses</title>
</svelte:head>

<div class="flex flex-col items-center justify-between gap-4 md:flex-row">
	<div class="space-y-0.5">
		<h2 class="text-2xl font-bold tracking-tight">Courses</h2>
		<p class="text-muted-foreground">You can find all the courses you have for this term here</p>
	</div>
	<a
		href={`/term/${data.activeTerm.id}/courses/new`}
		class={cn('w-full md:w-auto', buttonVariants())}><Plus /> Create new course</a
	>
</div>
<Separator class="my-8" />
<div class="grid gap-4">
	{#each data.courses as course}
		<CourseCard {course} />
	{/each}
</div>
