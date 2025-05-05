<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import type { Exam } from '$lib/server/db/schemas/exam';

	let { exams }: { exams: Exam[] } = $props();
</script>

<Card.Root class="transition-all">
	<Card.Header class="flex flex-row items-center gap-4 px-8 py-4">
		<Card.Title class="text-7xl">{exams.length}</Card.Title>
		<Card.Description class="text-base">
			{#if exams.length === 1}
				exam
			{:else}
				exams
			{/if}
			today
		</Card.Description>
	</Card.Header>
</Card.Root>
