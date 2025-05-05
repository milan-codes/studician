<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import type { Task } from '$lib/server/db/schemas/task';
	import { formatDate } from '$lib/utils';
	import { CheckCheck, Circle } from 'lucide-svelte';

	let { task, termId }: { task: Task & { color: string }; termId: string } = $props();
</script>

<a href={`/term/${termId}/tasks/${task.id}`}>
	<Card.Root class="transition-all hover:bg-muted">
		<Card.Header class="flex flex-row items-center justify-between gap-4 space-y-0">
			<div class="space-y-2">
				{#if task.status === 'DONE'}
					<Card.Title class="flex items-center gap-2"><CheckCheck /> {task.name}</Card.Title>
				{:else}
					<Card.Title>{task.name}</Card.Title>
				{/if}
				<Card.Description>
					{task.description ?? 'No description provided'}
				</Card.Description>
			</div>
		</Card.Header>
		<Card.Content>
			<div class="flex gap-4 text-sm text-muted-foreground">
				<div class="flex items-center">
					<Circle class="mr-1 h-4 w-4" fill={task.color} color={task.color} />
				</div>
				Updated {formatDate(task.updatedAt)}
			</div>
		</Card.Content>
	</Card.Root>
</a>
