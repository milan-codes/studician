<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import type { Activity } from '$lib/server/db/schemas/activity';
	import { formatDate } from '$lib/utils';
	import { Circle } from 'lucide-svelte';

	let { activity }: { activity: Activity } = $props();
</script>

<a href={`/term/${activity.termId}/activities/${activity.id}`}>
	<Card.Root class="transition-all hover:bg-muted">
		<Card.Header class="flex flex-row items-center justify-between gap-4 space-y-0">
			<div class="space-y-2">
				<Card.Title>{activity.name}</Card.Title>
				<Card.Description>
					{activity.description ?? 'No description provided'}
				</Card.Description>
			</div>
		</Card.Header>
		<Card.Content>
			<div class="flex gap-4 text-sm text-muted-foreground">
				<div class="flex items-center">
					<Circle class="mr-1 h-4 w-4" fill={activity.color} color={activity.color} />
				</div>
				Updated {formatDate(activity.updatedAt)}
			</div>
		</Card.Content>
	</Card.Root>
</a>
