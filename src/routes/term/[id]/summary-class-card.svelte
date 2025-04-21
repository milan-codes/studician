<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';

	let {
		courseClasses
	}: {
		courseClasses: {
			id: string;
			startDateTime: Date;
			endDateTime: Date;
			courseId: string;
			courseName: string;
			courseClassName: string;
			location: string;
			color: string;
		}[];
	} = $props();
</script>

<Card.Root class="transition-all">
	<Card.Header class="flex flex-row items-center gap-4 px-8 py-4">
		<Card.Title class="text-7xl">{courseClasses.length}</Card.Title>
		<Card.Description class="text-base">
			{#if courseClasses.length === 1}
				class
			{:else}
				classes
			{/if}
			today
		</Card.Description>
	</Card.Header>
</Card.Root>
