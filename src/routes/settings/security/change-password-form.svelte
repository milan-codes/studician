<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import SuperDebug, { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { formSchema, type FormSchema } from './schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { dev } from '$app/environment';
	import { toast } from 'svelte-sonner';

	let { data }: { data: { form: SuperValidated<Infer<FormSchema>> } } = $props();

	const form = superForm(data.form, {
		validators: zodClient(formSchema),
		onUpdate: ({ form, result }) => {
			if (result.status === 422) toast.error(form.message);
		},
		onResult: ({ result }) => {
			if (result.status === 204) toast.success('Successfully changed password');
		}
	});

	const { form: formData, enhance } = form;
</script>

<form method="POST" class="grid gap-4" use:enhance>
	<Form.Field {form} name="currentPassword">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Password</Form.Label>
				<Input {...props} type="password" bind:value={$formData.currentPassword} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="newPassword">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>New password</Form.Label>
				<Input {...props} type="password" bind:value={$formData.newPassword} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="newPasswordConfirm">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Confirm new password</Form.Label>
				<Input {...props} type="password" bind:value={$formData.newPasswordConfirm} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button class="w-max">Change password</Form.Button>
	<SuperDebug data={form.form} display={dev} />
</form>
