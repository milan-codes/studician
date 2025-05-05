<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import type { Exam } from '$lib/server/db/schemas/exam';
	import type { Task } from '$lib/server/db/schemas/task';
	import { formatDate, getHumanizedTimeElapsed } from '$lib/utils';
	import { Circle } from 'lucide-svelte';

	let {
		notification: notification,
		termId
	}: {
		notification: (Task | Exam) & { type: 'TASK' | 'EXAM' } & { color: string };
		termId: string;
	} = $props();

	const url = $derived(
		notification.type === 'TASK'
			? `/term/${termId}/tasks/${notification.id}`
			: `/term/${termId}/exams/${notification.id}`
	);

	const date = $derived(
		notification.type === 'TASK' ? (notification as Task).dueDate : (notification as Exam).date
	);
</script>

<a href={url}>
	<Card.Root class="transition-all hover:bg-muted">
		<Card.Header class="flex flex-row items-center justify-between gap-4 space-y-0">
			<div class="space-y-2">
				<Card.Title
					>{getHumanizedTimeElapsed(date, new Date())} until {notification.name}</Card.Title
				>
				<Card.Description>
					{notification.description ?? 'No description provided'}
				</Card.Description>
			</div>
		</Card.Header>
		<Card.Content>
			<div class="flex gap-4 text-sm text-muted-foreground">
				<div class="flex items-center">
					<Circle class="mr-1 h-4 w-4" fill={notification.color} color={notification.color} />
				</div>
				Updated {formatDate(notification.updatedAt)}
			</div>
		</Card.Content>
	</Card.Root>
</a>
