<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Separator } from '$lib/components/ui/separator';
	import { formatTime } from '$lib/utils';
	import { Circle } from 'lucide-svelte';

	let {
		activityEvent,
		termId
	}: {
		activityEvent: {
			id: string;
			startDateTime: Date;
			endDateTime: Date;
			activityId: string;
			activityName: string;
			color: string;
		};
		termId: string;
	} = $props();
</script>

<a href={`/term/${termId}/activities/${activityEvent.activityId}`}>
	<Card.Root class="transition-all hover:bg-muted">
		<Card.Header class="px-3 py-2">
			<div class="flex gap-2">
				<div class="grid min-w-max">
					<p class="text-sm text-muted-foreground">{formatTime(activityEvent.startDateTime)}</p>
					<p class="text-sm text-muted-foreground">{formatTime(activityEvent.endDateTime)}</p>
				</div>
				<Separator orientation="vertical" />
				<div class="grid w-full">
					<div class="flex items-center">
						<Circle class="mr-1 h-4 w-4" fill={activityEvent.color} color={activityEvent.color} />
						<Card.Title class="w-28 overflow-hidden text-ellipsis whitespace-nowrap text-sm">
							{activityEvent.activityName}
						</Card.Title>
					</div>
				</div>
			</div>
		</Card.Header>
	</Card.Root>
</a>
