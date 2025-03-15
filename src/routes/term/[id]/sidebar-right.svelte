<script lang="ts">
	import DatePicker from './date-picker.svelte';
	import NavUser from './nav-user.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { ComponentProps } from 'svelte';

	let {
		ref = $bindable(null),
		user,
		...restProps
	}: ComponentProps<typeof Sidebar.Root> & {
		user: { name: string | null; username: string; avatar?: string };
	} = $props();
</script>

<Sidebar.Root
	bind:ref
	collapsible="none"
	class="sticky top-0 hidden h-svh border-l lg:flex"
	{...restProps}
>
	<Sidebar.Header class="h-16 border-b border-sidebar-border">
		<NavUser {user} />
	</Sidebar.Header>
	<Sidebar.Content>
		<DatePicker />
		<Sidebar.Separator class="mx-0" />
	</Sidebar.Content>
</Sidebar.Root>
