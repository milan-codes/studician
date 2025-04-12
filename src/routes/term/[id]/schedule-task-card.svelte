<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Separator } from '$lib/components/ui/separator';
	import type { Task } from '$lib/server/db/schemas/task';
	import { formatTime } from '$lib/utils';
	import { Circle } from 'lucide-svelte';

	let { task, termId }: { task: Task & { courseName: string; color: string }; termId: string } =
		$props();
</script>

<a href={`/term/${termId}/tasks/${task.id}`}>
	<Card.Root class="transition-all hover:bg-muted">
		<Card.Header class="px-3 py-2">
			<div class="flex gap-2">
				<div class="flex min-w-max flex-col justify-center">
					<p class="text-sm text-muted-foreground">{formatTime(task.dueDate)}</p>
				</div>
				<Separator orientation="vertical" />
				<div class="grid w-full">
					<div class="flex items-center">
						<Circle class="mr-1 h-4 w-4" fill={task.color} color={task.color} />
						<Card.Title class="w-24 overflow-hidden text-ellipsis whitespace-nowrap text-sm"
							>{task.courseName}</Card.Title
						>
					</div>
					<Card.Description class="w-24 overflow-hidden text-ellipsis text-sm">
						{task.name ?? 'No name provided'}
					</Card.Description>
				</div>
			</div>
		</Card.Header>
	</Card.Root>
</a>
