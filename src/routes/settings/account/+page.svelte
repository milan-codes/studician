<script lang="ts">
	import { Separator } from '$lib/components/ui/separator';
	import type { PageData } from './$types';
	import AccountSettingsForm from './account-settings-form.svelte';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Account settings</title>
</svelte:head>

<div class="flex flex-col items-center justify-between gap-4 md:flex-row">
	<div class="space-y-0.5">
		<h2 class="text-2xl font-bold tracking-tight">Account settings</h2>
		<p class="text-muted-foreground">You can find all the settings related to your account here</p>
	</div>
</div>
<Separator class="my-8" />
<AccountSettingsForm {data} />
