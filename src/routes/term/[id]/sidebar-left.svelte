<script lang="ts">
	import Calendar from 'lucide-svelte/icons/calendar';
	import House from 'lucide-svelte/icons/house';
	import Inbox from 'lucide-svelte/icons/inbox';
	import Search from 'lucide-svelte/icons/search';
	import Settings2 from 'lucide-svelte/icons/settings-2';
	import Sparkles from 'lucide-svelte/icons/sparkles';

	import NavFavorites from './nav-favorites.svelte';
	import NavMain from '$lib/components/nav-main.svelte';
	import NavSecondary from './nav-secondary.svelte';
	import TermSwitcher from './term-switcher.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { ComponentProps } from 'svelte';
	import type { Term } from '$lib/server/db/schemas/term';
	import { BookOpenCheck, BookText, CalendarDays, LayoutList, NotebookPen } from 'lucide-svelte';
	import type { Course } from '$lib/server/db/schemas/course';

	let {
		ref = $bindable(null),
		activeTerm,
		terms,
		favorites,
		...restProps
	}: ComponentProps<typeof Sidebar.Root> & {
		activeTerm: Term;
		terms: Term[];
		favorites: Course[];
	} = $props();

	const data = $derived({
		navMain: [
			{
				title: 'Search',
				url: `/term/${activeTerm.id}/search`,
				icon: Search
			},
			{
				title: 'Ask AI',
				url: `/term/${activeTerm.id}/ask-ai`,
				icon: Sparkles
			},
			{
				title: 'Home',
				url: `/term/${activeTerm.id}`,
				icon: House,
				isIndex: true
			},
			{
				title: 'Calendar',
				url: `/term/${activeTerm.id}/calendar`,
				icon: Calendar
			},
			{
				title: 'Inbox',
				url: `/term/${activeTerm.id}/inbox`,
				icon: Inbox
			},
			{
				title: 'Courses',
				url: `/term/${activeTerm.id}/courses`,
				icon: BookText
			},
			{
				title: 'Tasks',
				url: `/term/${activeTerm.id}/tasks`,
				icon: LayoutList
			},
			{
				title: 'Exams',
				url: `/term/${activeTerm.id}/exams`,
				icon: BookOpenCheck
			},
			{
				title: 'Notes',
				url: `/term/${activeTerm.id}/notes`,
				icon: NotebookPen
			},
			{
				title: 'Activities',
				url: `/term/${activeTerm.id}/activities`,
				icon: CalendarDays
			}
		],
		navSecondary: [
			{
				title: 'Settings',
				url: '/settings',
				icon: Settings2
			}
		]
	});
</script>

<Sidebar.Root class="border-r-0" {...restProps}>
	<Sidebar.Header>
		<TermSwitcher {activeTerm} {terms} />
		<NavMain items={data.navMain} />
	</Sidebar.Header>
	<Sidebar.Content>
		<NavFavorites {favorites} />
		<NavSecondary items={data.navSecondary} class="mt-auto" />
	</Sidebar.Content>
	<Sidebar.Rail />
</Sidebar.Root>
