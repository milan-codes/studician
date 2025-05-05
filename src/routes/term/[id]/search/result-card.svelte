<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { formatDate } from '$lib/utils';
	import { Circle } from 'lucide-svelte';

	let {
		title,
		description,
		color,
		url,
		updatedAt
	}: {
		title: string;
		description: string | null;
		color: string;
		url: string;
		updatedAt: Date;
	} = $props();
</script>

<a href={url}>
	<Card.Root class="transition-all hover:bg-muted">
		<Card.Header class="flex flex-row items-center justify-between gap-4 space-y-0">
			<div class="space-y-2">
				<Card.Title>{title}</Card.Title>
				<Card.Description>
					{description ?? 'No description provided'}
				</Card.Description>
			</div>
		</Card.Header>
		<Card.Content>
			<div class="flex gap-4 text-sm text-muted-foreground">
				<div class="flex items-center">
					<Circle class="mr-1 h-4 w-4" fill={color} {color} />
				</div>
				Updated {formatDate(updatedAt)}
			</div>
		</Card.Content>
	</Card.Root>
</a>
