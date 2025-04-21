<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { ComponentProps } from 'svelte';
	import { ArrowLeft, CircleUser, LockKeyhole, ShieldUser } from 'lucide-svelte';
	import NavMain from '$lib/components/nav-main.svelte';
	import { buttonVariants } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';

	let { ref = $bindable(null), ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();

	const data = $derived({
		navMain: [
			{
				title: 'Profile',
				url: '/settings',
				icon: CircleUser
			},
			{
				title: 'Account',
				url: '/settings/account',
				icon: ShieldUser
			},
			{
				title: 'Security',
				url: '/settings/security',
				icon: LockKeyhole
			}
		]
	});
</script>

<Sidebar.Root class="border-r-0" {...restProps}>
	<Sidebar.Header>
		<a href="/term" class={cn(buttonVariants({ variant: 'ghost' }), 'justify-start text-sm')}
			><ArrowLeft /> Go back</a
		>
		<NavMain items={data.navMain} />
	</Sidebar.Header>
	<Sidebar.Rail />
</Sidebar.Root>
