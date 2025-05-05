<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import SuperDebug, { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { formSchema, type FormSchema } from './schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { dev } from '$app/environment';
	import { Textarea } from '$lib/components/ui/textarea';

	let { data }: { data: { form: SuperValidated<Infer<FormSchema>> } } = $props();

	const form = superForm(data.form, {
		validators: zodClient(formSchema)
	});

	const { form: formData, enhance } = form;
</script>

<Card.Root class="mx-auto w-full max-w-sm">
	<Card.Header>
		<Card.Title class="text-2xl">Complete profile</Card.Title>
		<Card.Description>Let's complete your profile</Card.Description>
	</Card.Header>
	<Card.Content>
		<form method="POST" class="grid gap-4" use:enhance>
			<div class="grid gap-2">
				<Form.Field {form} name="displayName">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Display name</Form.Label>
							<Input {...props} bind:value={$formData.displayName} />
							<Form.Description
								>This name will be visible to all users, if it's left empty, only your username will
								be shown</Form.Description
							>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
			<Form.Button class="w-full">Complete profile</Form.Button>
			<SuperDebug data={form.form} display={dev} />
		</form>
	</Card.Content>
</Card.Root>
