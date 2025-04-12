<script lang="ts">
	import DatePicker from './date-picker.svelte';
	import NavUser from './nav-user.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { ComponentProps } from 'svelte';
	import { getLocalTimeZone, today, type DateValue } from '@internationalized/date';
	import { page } from '$app/state';
	import type { CourseSchedule } from '$lib/server/db/schemas/courseSchedule';
	import type { Task } from '$lib/server/db/schemas/task';
	import type { Exam } from '$lib/server/db/schemas/exam';
	import ScheduleClassCard from './schedule-class-card.svelte';
	import ScheduleTaskCard from './schedule-task-card.svelte';
	import ScheduleExamCard from './schedule-exam-card.svelte';

	type CourseInformation = { courseName: string; color: string };
	type Schedule = {
		schedule: {
			classes: (CourseSchedule & CourseInformation)[];
			tasks: (Task & CourseInformation)[];
			exams: (Exam & CourseInformation)[];
		};
	};

	let {
		ref = $bindable(null),
		user,
		...restProps
	}: ComponentProps<typeof Sidebar.Root> & {
		user: { name: string | null; username: string; avatar?: string };
	} = $props();

	let termId = $derived(page.params.id);
	let selectedDate = $state<DateValue>(today(getLocalTimeZone()));
	let schedule = $state<Schedule>();

	async function getSchedule() {
		const response = await fetch(`/api/schedule?date=${selectedDate.toString()}&termId=${termId}`, {
			method: 'GET'
		});
		schedule = await response.json();
	}
</script>

<Sidebar.Root
	bind:ref
	collapsible="none"
	class="sticky top-0 hidden h-svh border-l lg:flex"
	{...restProps}
>
	<Sidebar.Header class="h-16 border-b border-sidebar-border">
		<NavUser {user} />
	</Sidebar.Header>
	<Sidebar.Content>
		<DatePicker bind:value={selectedDate} />
		<Sidebar.Separator class="mx-0 mb-2" />
		<div class="overflow-y-auto">
			{#await getSchedule()}
				<div class="px-2">Loading schedule...</div>
			{:then _}
				{#if schedule}
					{#if schedule.schedule.classes.length}
						<div class="grid gap-2 px-2">
							{#each schedule.schedule.classes as courseClass}
								<ScheduleClassCard {courseClass} {termId} />
							{/each}
						</div>
					{/if}
					{#if schedule.schedule.tasks.length}
						<Sidebar.Separator class="mx-0 my-4" />
						<div class="grid gap-2 px-2">
							{#each schedule.schedule.tasks as task}
								<ScheduleTaskCard {task} {termId} />
							{/each}
						</div>
					{/if}
					{#if schedule.schedule.exams.length}
						<Sidebar.Separator class="mx-0 my-4" />
						<div class="grid gap-2 px-2">
							{#each schedule.schedule.exams as exam}
								<ScheduleExamCard {exam} {termId} />
							{/each}
						</div>
					{/if}
				{:else}
					<div>There was an error while trying to get your schedule</div>
				{/if}
			{/await}
		</div>
	</Sidebar.Content>
</Sidebar.Root>
