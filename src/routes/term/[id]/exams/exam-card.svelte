<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import type { Exam } from '$lib/server/db/schemas/exam';
	import { formatDate } from '$lib/utils';
	import { CheckCheck, Circle } from 'lucide-svelte';

	let { exam, termId }: { exam: Exam & { color: string }; termId: string } = $props();

	let isPastExam = $derived(new Date(exam.date) < new Date());
</script>

<a href={`/term/${termId}/exams/${exam.id}`}>
	<Card.Root class="transition-all hover:bg-muted">
		<Card.Header class="flex flex-row items-center justify-between gap-4 space-y-0">
			<div class="space-y-2">
				{#if isPastExam}
					<Card.Title class="flex items-center gap-2"><CheckCheck /> {exam.name}</Card.Title>
				{:else}
					<Card.Title>{exam.name}</Card.Title>
				{/if}
				<Card.Description>
					{exam.description ?? 'No description provided'}
				</Card.Description>
			</div>
		</Card.Header>
		<Card.Content>
			<div class="flex gap-4 text-sm text-muted-foreground">
				<div class="flex items-center">
					<Circle class="mr-1 h-4 w-4" fill={exam.color} color={exam.color} />
				</div>
				Updated {formatDate(exam.updatedAt)}
			</div>
		</Card.Content>
	</Card.Root>
</a>
