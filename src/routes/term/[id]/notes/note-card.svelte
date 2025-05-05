<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import type { Note } from '$lib/server/db/schemas/note';
	import { formatDate } from '$lib/utils';
	import { Circle } from 'lucide-svelte';

	let { note, termId }: { note: Note & { color: string }; termId: string } = $props();
</script>

<a href={`/term/${termId}/notes/${note.id}`}>
	<Card.Root class="transition-all hover:bg-muted">
		<Card.Header class="flex flex-row items-center justify-between gap-4 space-y-0">
			<div class="space-y-2">
				<Card.Title>{note.name}</Card.Title>
				<Card.Description>
					{note.description ?? 'No description provided'}
				</Card.Description>
			</div>
		</Card.Header>
		<Card.Content>
			<div class="flex gap-4 text-sm text-muted-foreground">
				<div class="flex items-center">
					<Circle class="mr-1 h-4 w-4" fill={note.color} color={note.color} />
				</div>
				Updated {formatDate(note.updatedAt)}
			</div>
		</Card.Content>
	</Card.Root>
</a>
