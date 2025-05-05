<script lang="ts">
	import { Separator } from '$lib/components/ui/separator';
	import type { PageData } from './$types';
	import DeleteSemesterDialog from './delete-semester-dialog.svelte';
	import EditSemesterForm from './edit-semester-form.svelte';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Edit term</title>
</svelte:head>

<div class="flex h-screen w-full items-center justify-center px-4">
	<div>
		<EditSemesterForm {data} />
		<Separator class="my-4" />
		<DeleteSemesterDialog />
	</div>
</div>
