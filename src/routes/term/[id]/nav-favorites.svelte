<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';
	import type { Course } from '$lib/server/db/schemas/course';
	import { Circle } from 'lucide-svelte';
	import ArrowUpRight from 'lucide-svelte/icons/arrow-up-right';
	import Ellipsis from 'lucide-svelte/icons/ellipsis';

	let { favorites }: { favorites: Course[] } = $props();

	const sidebar = useSidebar();
</script>

<Sidebar.Group class="group-data-[collapsible=icon]:hidden">
	<Sidebar.GroupLabel>Favorites</Sidebar.GroupLabel>
	<Sidebar.Menu>
		{#each favorites as course}
			<Sidebar.MenuItem>
				<Sidebar.MenuButton>
					{#snippet child({ props })}
						<a href={`/term/${course.termId}/courses/${course.id}`} title={course.name} {...props}>
							<Circle class="mr-1 h-4 w-4" fill={course.color} color={course.color} />
							<span>{course.name}</span>
						</a>
					{/snippet}
				</Sidebar.MenuButton>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Sidebar.MenuAction showOnHover {...props}>
								<Ellipsis />
								<span class="sr-only">More</span>
							</Sidebar.MenuAction>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content
						class="w-56 rounded-lg"
						side={sidebar.isMobile ? 'bottom' : 'right'}
						align={sidebar.isMobile ? 'end' : 'start'}
					>
						<DropdownMenu.Item>
							<a
								href={`/term/${course.termId}/courses/${course.id}`}
								target="_blank"
								class="flex items-center gap-2"
							>
								<ArrowUpRight class="text-muted-foreground" />
								<span>Open in New Tab</span>
							</a>
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</Sidebar.MenuItem>
		{/each}
	</Sidebar.Menu>
</Sidebar.Group>
