<script lang="ts">
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import SuperDebug, { dateProxy, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { dev } from '$app/environment';
	import * as Form from '$lib/components/ui/form/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { formSchema, type FormSchema } from './schema';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';

	let { data }: { data: { form: SuperValidated<Infer<FormSchema>> } } = $props();
	let isEditing = $state(false);

	const form = superForm(data.form, {
		validators: zodClient(formSchema)
	});

	const startDateProxy = dateProxy(form, 'startDate', { format: 'date-local' });
	const classEndDateProxy = dateProxy(form, 'classEndDate', { format: 'date-local' });
	const examPeriodEndDateProxy = dateProxy(form, 'examPeriodEndDate', { format: 'date-local' });

	const { form: formData, enhance } = form;
</script>

<Card.Root class="mx-auto w-full max-w-sm">
	<Card.Header>
		<Card.Title class="text-2xl">Create term</Card.Title>
		<Card.Description>Let's start with the most important details</Card.Description>
	</Card.Header>
	<Card.Content>
		<form method="POST" action="?/update" class="grid gap-4" use:enhance>
			<Form.Field {form} name="startDate">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Start date</Form.Label>
						<Input
							{...props}
							type="date"
							class="appearance-none"
							bind:value={$startDateProxy}
							disabled={!isEditing}
						/>
						<Form.FieldErrors />
					{/snippet}
				</Form.Control>
			</Form.Field>
			<Form.Field {form} name="classEndDate">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Class end date</Form.Label>
						<Input
							{...props}
							type="date"
							class="appearance-none"
							bind:value={$classEndDateProxy}
							disabled={!isEditing}
						/>
						<Form.FieldErrors />
					{/snippet}
				</Form.Control>
			</Form.Field>
			<Form.Field {form} name="examPeriodEndDate">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Exam period end date</Form.Label>
						<Input
							{...props}
							type="date"
							class="appearance-none"
							bind:value={$examPeriodEndDateProxy}
							disabled={!isEditing}
						/>
						<Form.FieldErrors />
					{/snippet}
				</Form.Control>
			</Form.Field>
			{#if isEditing}
				<Form.Button class="w-full">Update term</Form.Button>
			{:else}
				<Button variant="outline" onclick={() => (isEditing = !isEditing)}>Edit term</Button>
			{/if}
			<SuperDebug data={$formData} display={dev} />
		</form>
	</Card.Content>
</Card.Root>
