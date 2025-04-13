<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import type { Task } from '$lib/server/db/schemas/task';

	let { tasks }: { tasks: Task[] } = $props();
</script>

<Card.Root class="transition-all">
	<Card.Header class="flex flex-row items-center gap-4 px-8 py-4">
		<Card.Title class="text-7xl">{tasks.length}</Card.Title>
		<Card.Description class="text-base">
			{#if tasks.length === 1}
				task
			{:else}
				tasks
			{/if}
			due
		</Card.Description>
	</Card.Header>
</Card.Root>
