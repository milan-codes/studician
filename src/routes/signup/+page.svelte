<script lang="ts">
	import type { PageData } from './$types';
	import SignupForm from './signup-form.svelte';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Sign up</title>
</svelte:head>

<div class="flex h-screen w-full items-center justify-center px-4">
	<SignupForm {data} />
</div>
