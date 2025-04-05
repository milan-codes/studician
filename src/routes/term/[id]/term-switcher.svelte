<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { Term } from '$lib/server/db/schemas/term';
	import { formatDate } from '$lib/utils';
	import { Check } from 'lucide-svelte';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import Plus from 'lucide-svelte/icons/plus';

	let {
		activeTerm,
		terms: terms
	}: {
		activeTerm: Term;
		terms: Term[];
	} = $props();
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Sidebar.MenuButton {...props} class="w-fit px-1.5">
						<span class="truncate font-semibold"
							>{formatDate(activeTerm.startDate)} - {formatDate(activeTerm.classEndDate)}</span
						>
						<ChevronDown class="opacity-50" />
					</Sidebar.MenuButton>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="w-64 rounded-lg" align="start" side="bottom" sideOffset={4}>
				<DropdownMenu.Label class="text-xs text-muted-foreground">Terms</DropdownMenu.Label>
				{#each terms as term, index}
					<DropdownMenu.Item onSelect={() => (activeTerm = term)} class="gap-2 p-2">
						<a href={`/term/${term.id}`} class="flex w-full items-center gap-2">
							{#if activeTerm.id === term.id}
								<Check />
							{/if}
							{formatDate(term.startDate)} - {formatDate(term.classEndDate)}
							<DropdownMenu.Shortcut>⌘{index + 1}</DropdownMenu.Shortcut>
						</a>
					</DropdownMenu.Item>
				{/each}
				<DropdownMenu.Separator />
				<DropdownMenu.Item class="gap-2 p-2">
					<a href="/term/new" class="flex w-full items-center gap-2">
						<div class="flex size-6 items-center justify-center rounded-md border bg-background">
							<Plus class="size-4" />
						</div>
						<div class="font-medium text-muted-foreground">Add semester</div>
					</a>
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Sidebar.MenuItem>
</Sidebar.Menu>
