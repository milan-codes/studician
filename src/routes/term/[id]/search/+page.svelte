<script lang="ts">
	import { Separator } from '$lib/components/ui/separator';
	import type { PageProps } from './$types';
	import ResultCard from './result-card.svelte';
	import SearchForm from './search-form.svelte';
	import Sprinting from '$lib/illustrations/sprinting.svg';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Search</title>
</svelte:head>

<div class="flex flex-col items-center justify-between gap-4 md:flex-row">
	<div class="space-y-0.5">
		<h2 class="text-2xl font-bold tracking-tight">Search</h2>
		<p class="text-muted-foreground">You can search for any data related to this term here</p>
	</div>
</div>
<Separator class="my-8" />
<SearchForm {data} />

{#if data.results.length}
	{#each data.results as { id, name, description, color, type, updatedAt }}
		{@const url = `/term/${data.activeTerm.id}/${type}s/${id}`}
		<ResultCard title={name} {description} {color} {url} {updatedAt} />
	{/each}
{:else if data.form.data.query}
	<div class="my-4 flex h-full w-full flex-col items-center justify-center gap-4 md:gap-16">
		<div class="w-9/12 md:w-1/3">
			<img src={Sprinting} alt="Illustration of a person running" />
		</div>
		<p class="text-center">
			It looks like there are no results for your query. Go ahead and create the stuff you were
			looking for!
		</p>
	</div>
{/if}
