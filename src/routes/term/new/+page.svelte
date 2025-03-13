<script lang="ts">
	import type { PageData } from './$types';
	import AddSemesterForm from './add-semester-form.svelte';

	let { data }: { data: PageData } = $props();
</script>

<div class="flex h-screen w-full items-center justify-center px-4">
	<AddSemesterForm {data} />
</div>
