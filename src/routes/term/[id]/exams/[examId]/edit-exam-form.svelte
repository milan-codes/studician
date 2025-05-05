<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import SuperDebug, {
		dateProxy,
		superForm,
		type Infer,
		type SuperValidated
	} from 'sveltekit-superforms';
	import { formSchema, type FormSchema } from './schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { dev } from '$app/environment';
	import { Textarea } from '$lib/components/ui/textarea';
	import type { Course } from '$lib/server/db/schemas/course';
	import { Button } from '$lib/components/ui/button';

	let { data }: { data: { form: SuperValidated<Infer<FormSchema>>; courses: Course[] } } = $props();
	let isEditing = $state(false);

	const form = superForm(data.form, {
		validators: zodClient(formSchema)
	});

	const examDateProxy = dateProxy(form, 'date', { format: 'datetime-local' });

	const { form: formData, enhance } = form;
</script>

<form method="POST" action="?/update" class="grid gap-4" use:enhance>
	<Form.Field {form} name="courseId">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Course</Form.Label>
				<select
					{...props}
					class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
					bind:value={$formData.courseId}
					disabled={!isEditing}
				>
					{#each data.courses as course}
						<option value={course.id}>{course.name}</option>
					{/each}
				</select>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="name">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Name</Form.Label>
				<Input {...props} bind:value={$formData.name} disabled={!isEditing} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="description">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Description</Form.Label>
				<Textarea {...props} bind:value={$formData.description} disabled={!isEditing} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="date">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Date</Form.Label>
				<Input
					{...props}
					type="datetime-local"
					class="appearance-none"
					bind:value={$examDateProxy}
					disabled={!isEditing}
				/>
				<Form.FieldErrors />
			{/snippet}
		</Form.Control>
	</Form.Field>
	<Form.Field {form} name="length">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Length</Form.Label>
				<Input
					{...props}
					type="number"
					pattern="[0-9]*"
					inputmode="numeric"
					bind:value={$formData.length}
					disabled={!isEditing}
				/>
				<Form.FieldErrors />
			{/snippet}
		</Form.Control>
	</Form.Field>
	{#if isEditing}
		<Form.Button>Update exam</Form.Button>
	{:else}
		<Button variant="outline" onclick={() => (isEditing = !isEditing)}>Edit exam</Button>
	{/if}
	<SuperDebug data={form.form} display={dev} />
</form>
