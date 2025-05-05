<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import SuperDebug, { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { formSchema, type FormSchema } from './schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { dev } from '$app/environment';
	import { Textarea } from '$lib/components/ui/textarea';
	import { toast } from 'svelte-sonner';

	let { data }: { data: { form: SuperValidated<Infer<FormSchema>> } } = $props();

	const form = superForm(data.form, {
		validators: zodClient(formSchema),
		onResult: ({ result }) => {
			if (result.status === 204) toast.success('Profile updated successfully');
		}
	});

	const { form: formData, enhance } = form;
</script>

<form method="POST" class="grid gap-4" use:enhance>
	<div class="grid gap-2">
		<Form.Field {form} name="displayName">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Display name</Form.Label>
					<Input {...props} bind:value={$formData.displayName} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</div>
	<Form.Button class="w-max">Update profile</Form.Button>
	<SuperDebug data={form.form} display={dev} />
</form>
