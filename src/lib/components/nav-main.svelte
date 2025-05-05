<script lang="ts">
	import { page } from '$app/state';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';

	// The `any` should be `Component` after lucide-svelte updates types
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let { items }: { items: { title: string; url: string; icon: any; isIndex?: boolean }[] } =
		$props();
</script>

<Sidebar.Menu>
	{#each items as item (item.title)}
		{@const isActive =
			(page.url.pathname.startsWith(item.url) && !item.isIndex) || page.url.pathname === item.url}
		<Sidebar.MenuItem>
			<Sidebar.MenuButton {isActive}>
				{#snippet child({ props })}
					<a href={item.url} {...props}>
						<item.icon />
						<span>{item.title}</span>
					</a>
				{/snippet}
			</Sidebar.MenuButton>
		</Sidebar.MenuItem>
	{/each}
</Sidebar.Menu>
