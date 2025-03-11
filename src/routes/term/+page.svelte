<script lang="ts">
	import type { PageData } from './$types';
	import TermSelect from './term-select.svelte';

	let { data }: { data: PageData } = $props();
</script>

<div class="flex h-screen w-full items-center justify-center px-4">
	<TermSelect {data} />
</div>
