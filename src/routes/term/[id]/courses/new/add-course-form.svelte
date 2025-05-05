<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import SuperDebug, { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { formSchema, type FormSchema } from './schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { dev } from '$app/environment';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { cn } from '$lib/utils';
	import { Checkbox } from '$lib/components/ui/checkbox';

	let { data }: { data: { form: SuperValidated<Infer<FormSchema>> } } = $props();

	const form = superForm(data.form, {
		dataType: 'json',
		validators: zodClient(formSchema)
	});

	const { form: formData, enhance } = form;

	function addClass() {
		$formData.classes = [
			...$formData.classes,
			{
				name: '',
				dayOfWeek: '1',
				startTime: '08:00',
				endTime: '09:30',
				location: '',
				recurrence: 'WEEKLY'
			}
		];
	}

	function removeClass(index: number) {
		$formData.classes = $formData.classes.toSpliced(index);
	}

	const daysOfWeek = [
		{ value: '1', label: 'Monday' },
		{ value: '2', label: 'Tuesday' },
		{ value: '3', label: 'Wednesday' },
		{ value: '4', label: 'Thursday' },
		{ value: '5', label: 'Friday' },
		{ value: '6', label: 'Saturday' },
		{ value: '0', label: 'Sunday' }
	] as const;

	const recurrences = [
		{ value: 'WEEKLY', label: 'Weekly' },
		{ value: 'BIWEEKLY', label: 'Biweekly' }
	] as const;
</script>

<form method="POST" class="grid gap-4" use:enhance>
	<div class="grid grid-cols-1 gap-4 md:grid-cols-10">
		<Form.Field {form} name="name" class="col-span-10 md:col-span-9">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Name</Form.Label>
					<Input {...props} bind:value={$formData.name} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="color" class="col-span-10 md:col-span-1">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Color</Form.Label>
					<Input {...props} type="color" bind:value={$formData.color} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</div>
	<Form.Field {form} name="description">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Description</Form.Label>
				<Textarea {...props} bind:value={$formData.description} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<h3 class="text-md tracking-tight">Classes</h3>
	{#each $formData.classes as _, index}
		<div class="grid grid-cols-1 gap-4 md:grid-cols-7">
			<Form.Field {form} name="classes[{index}].name">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label class={cn(index !== 0 && 'sr-only')}>Name</Form.Label>
						<Input {...props} bind:value={$formData.classes[index].name} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="classes[{index}].dayOfWeek">
				<Form.Control>
					{#snippet children({ props })}
						{@const day = daysOfWeek.find(
							(dayOfWeek) => dayOfWeek.value === $formData.classes[index].dayOfWeek
						)}
						<Form.Label class={cn(index !== 0 && 'sr-only')}>Day of week</Form.Label>
						<Select.Root
							type="single"
							bind:value={$formData.classes[index].dayOfWeek}
							name={props.name}
						>
							<Select.Trigger {...props}>
								{day ? day.label : 'Select the day of week'}
							</Select.Trigger>
							<Select.Content>
								{#each daysOfWeek as { value, label }}
									<Select.SelectItem {value} {label} />
								{/each}
							</Select.Content>
						</Select.Root>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="classes[{index}].startTime">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label class={cn(index !== 0 && 'sr-only')}>Start time</Form.Label>
						<Input {...props} type="time" bind:value={$formData.classes[index].startTime} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="classes[{index}].endTime">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label class={cn(index !== 0 && 'sr-only')}>End time</Form.Label>
						<Input {...props} type="time" bind:value={$formData.classes[index].endTime} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="classes[{index}].location">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label class={cn(index !== 0 && 'sr-only')}>Location</Form.Label>
						<Input {...props} bind:value={$formData.classes[index].location} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="classes[{index}].recurrence">
				<Form.Control>
					{#snippet children({ props })}
						{@const recurrence = recurrences.find(
							(recurrence) => recurrence.value === $formData.classes[index].recurrence
						)}
						<Form.Label class={cn(index !== 0 && 'sr-only')}>Recurrence</Form.Label>
						<Select.Root
							type="single"
							bind:value={$formData.classes[index].recurrence}
							name={props.name}
						>
							<Select.Trigger {...props}>
								{recurrence ? recurrence.label : 'Select recurrence'}
							</Select.Trigger>
							<Select.Content>
								{#each recurrences as { value, label }}
									<Select.SelectItem {value} {label} />
								{/each}
							</Select.Content>
						</Select.Root>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<div class="my-2 grid items-end">
				<Button type="button" variant="destructive" onclick={() => removeClass(index)}
					>Remove class</Button
				>
			</div>
		</div>
	{/each}
	<Button type="button" variant="outline" onclick={() => addClass()}>Add class</Button>
	<Separator class="my-8" />
	<Form.Field {form} name="favorite">
		<Form.Control>
			{#snippet children({ props })}
				<div class="flex items-center gap-2">
					<Checkbox {...props} bind:checked={$formData.favorite} />
					<Form.Label>Add to favorites</Form.Label>
				</div>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button>Create course</Form.Button>
	<SuperDebug data={form.form} display={dev} />
</form>
