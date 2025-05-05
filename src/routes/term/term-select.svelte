<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card/index.js';
	import type { Term } from '$lib/server/db/schemas/term';
	import { cn, formatDate } from '$lib/utils';
	import { Plus } from 'lucide-svelte';

	let { data }: { data: { terms: Term[]; total: number } } = $props();
</script>

<Card.Root class="mx-auto w-full max-w-lg">
	<Card.Header>
		<div
			class="flex flex-col items-start justify-normal gap-2 md:flex-row md:items-center md:justify-between md:gap-0"
		>
			<div>
				<Card.Title class="text-2xl">Select term</Card.Title>
				<Card.Description>Select the term you want to see</Card.Description>
			</div>
			<a href="/term/new" class={cn(buttonVariants(), 'w-full md:w-auto')}>
				<Plus /> Create new term
			</a>
		</div>
	</Card.Header>
	<Card.Content>
		{#if data.total !== 0}
			<div class="grid gap-4">
				{#each data.terms as term}
					<div class="flex flex-col gap-2">
						<a
							href={`/term/${term.id}`}
							class="flex flex-col items-start justify-normal rounded-md border bg-popover p-4 transition-all hover:bg-muted md:flex-row md:items-center md:justify-between"
						>
							<p class="text-sm font-medium leading-none">
								{formatDate(term.startDate)} - {formatDate(term.classEndDate)}
							</p>
							<p class="text-sm text-muted-foreground">
								Exam period ends: {formatDate(term.examPeriodEndDate)}
							</p>
						</a>
						<a href={`/term/edit/${term.id}`} class={buttonVariants({ variant: 'outline' })}>Edit</a
						>
					</div>
				{/each}
			</div>
		{:else}
			<p class="text-sm text-muted-foreground">You don't have any terms yet.</p>
		{/if}
	</Card.Content>
</Card.Root>
