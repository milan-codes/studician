<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import SuperDebug, { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { formSchema, type FormSchema } from './schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { dev } from '$app/environment';
	import { Search } from 'lucide-svelte';

	let { data }: { data: { form: SuperValidated<Infer<FormSchema>> } } = $props();

	const form = superForm(data.form, {
		validators: zodClient(formSchema)
	});

	const { form: formData, enhance } = form;
</script>

<form method="POST" class="flex items-center gap-4" use:enhance>
	<Form.Field {form} name="query" class="w-full">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label class="sr-only">Query</Form.Label>
				<Input {...props} bind:value={$formData.query} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button><Search /> Search</Form.Button>
</form>
<SuperDebug data={form.form} display={dev} />
