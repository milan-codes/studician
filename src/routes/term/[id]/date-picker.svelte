<script lang="ts">
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { DateValue } from '@internationalized/date';

	let { value = $bindable() }: { value: DateValue } = $props();
</script>

<Sidebar.Group class="px-0">
	<Sidebar.GroupContent>
		<Calendar
			type="single"
			class="select-none [&_[data-bits-calendar-head-cell]]:w-[33px] [&_[role=gridcell]]:w-[33px]"
			bind:value
		/>
	</Sidebar.GroupContent>
</Sidebar.Group>
