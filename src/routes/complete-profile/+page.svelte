<script lang="ts">
	import type { PageData } from './$types';
	import CompleteProfileForm from './complete-profile-form.svelte';

	let { data }: { data: PageData } = $props();
</script>

<div class="flex h-screen w-full items-center justify-center px-4">
	<CompleteProfileForm {data} />
</div>
