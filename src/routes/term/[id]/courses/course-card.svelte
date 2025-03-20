<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import type { Course } from '$lib/server/db/schemas/course';
	import { formatDate } from '$lib/utils';
	import { Circle } from 'lucide-svelte';

	let { course }: { course: Course } = $props();
</script>

<a href={`/term/${course.termId}/courses/${course.id}`}>
	<Card.Root class="transition-all hover:bg-muted">
		<Card.Header class="flex flex-row items-center justify-between gap-4 space-y-0">
			<div class="space-y-2">
				<Card.Title>{course.name}</Card.Title>
				<Card.Description>
					{course.description ?? 'No description provided'}
				</Card.Description>
			</div>
		</Card.Header>
		<Card.Content>
			<div class="flex gap-4 text-sm text-muted-foreground">
				<div class="flex items-center">
					<Circle class="mr-1 h-4 w-4" fill={course.color} color={course.color} />
				</div>
				Updated {formatDate(course.updatedAt)}
			</div>
		</Card.Content>
	</Card.Root>
</a>
