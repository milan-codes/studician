<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import SuperDebug, { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { formSchema, type FormSchema } from './schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { dev } from '$app/environment';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Separator } from '$lib/components/ui/separator';
	import { Button } from '$lib/components/ui/button';

	let { data }: { data: { form: SuperValidated<Infer<FormSchema>> } } = $props();
	let isEditing = $state(false);

	const form = superForm(data.form, {
		dataType: 'json',
		validators: zodClient(formSchema)
	});

	const { form: formData, enhance } = form;
</script>

<form method="POST" class="grid gap-4" use:enhance>
	<div class="grid grid-cols-1 gap-4 md:grid-cols-10">
		<Form.Field {form} name="name" class="col-span-10 md:col-span-9">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Name</Form.Label>
					<Input {...props} bind:value={$formData.name} disabled={!isEditing} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="color" class="col-span-10 md:col-span-1">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Color</Form.Label>
					<Input {...props} type="color" bind:value={$formData.color} disabled={!isEditing} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</div>
	<div class="grid gap-4">
		<Form.Field {form} name="description">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Description</Form.Label>
					<Textarea {...props} bind:value={$formData.description} disabled={!isEditing} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</div>
	<Separator class="my-8" />
	{#if isEditing}
		<Form.Button>Update course</Form.Button>
	{:else}
		<Button variant="outline" onclick={() => (isEditing = !isEditing)}>Edit course</Button>
	{/if}
	<SuperDebug data={form.form} display={dev} />
</form>
