<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Separator } from '$lib/components/ui/separator';
	import type { Exam } from '$lib/server/db/schemas/exam';
	import { formatTime } from '$lib/utils';
	import { Circle } from 'lucide-svelte';

	let { exam, termId }: { exam: Exam & { courseName: string; color: string }; termId: string } =
		$props();
</script>

<a href={`/term/${termId}/exams/${exam.id}`}>
	<Card.Root class="transition-all hover:bg-muted">
		<Card.Header class="px-3 py-2">
			<div class="flex gap-2">
				<div class="flex min-w-max flex-col justify-center">
					<p class="text-sm text-muted-foreground">{formatTime(exam.date)}</p>
				</div>
				<Separator orientation="vertical" />
				<div class="grid w-full">
					<div class="flex items-center">
						<Circle class="mr-1 h-4 w-4" fill={exam.color} color={exam.color} />
						<Card.Title class="w-28 overflow-hidden text-ellipsis whitespace-nowrap text-sm"
							>{exam.courseName}</Card.Title
						>
					</div>
					<Card.Description class="w-28 overflow-hidden text-ellipsis whitespace-nowrap text-sm">
						{exam.name ?? 'No name provided'}
					</Card.Description>
				</div>
			</div>
		</Card.Header>
	</Card.Root>
</a>
