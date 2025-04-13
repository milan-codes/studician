<script lang="ts">
	import type { PageData } from './$types';
	import LoginForm from './login-form.svelte';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<div class="flex h-screen w-full items-center justify-center px-4">
	<LoginForm {data} />
</div>
