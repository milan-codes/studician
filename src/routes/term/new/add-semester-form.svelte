<script lang="ts">
	import CalendarIcon from 'lucide-svelte/icons/calendar';
	import {
		CalendarDate,
		DateFormatter,
		type DateValue,
		fromDate,
		getLocalTimeZone
	} from '@internationalized/date';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { dev } from '$app/environment';
	import { cn } from '$lib/utils.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { formSchema, type FormSchema } from './schema';

	let { data }: { data: { form: SuperValidated<Infer<FormSchema>> } } = $props();

	const form = superForm(data.form, {
		validators: zodClient(formSchema)
	});

	const { form: formData, enhance } = form;

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let startDate = $state<DateValue | undefined>();
	$effect(() => {
		startDate = $formData.startDate ? fromDate($formData.startDate, getLocalTimeZone()) : undefined;
	});

	let classEndDate = $state<DateValue | undefined>();
	$effect(() => {
		classEndDate = $formData.classEndDate
			? fromDate($formData.classEndDate, getLocalTimeZone())
			: undefined;
	});

	let examPeriodEndDate = $state<DateValue | undefined>();
	$effect(() => {
		examPeriodEndDate = $formData.examPeriodEndDate
			? fromDate($formData.examPeriodEndDate, getLocalTimeZone())
			: undefined;
	});
</script>

<Card.Root class="mx-auto w-full max-w-sm">
	<Card.Header>
		<Card.Title class="text-2xl">Create term</Card.Title>
		<Card.Description>Let's start with the most important details</Card.Description>
	</Card.Header>
	<Card.Content>
		<form method="POST" class="space-y-8" use:enhance>
			<div class="grid gap-2">
				<Form.Field {form} name="startDate">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Start date</Form.Label>
							<Popover.Root>
								<Popover.Trigger
									{...props}
									class={cn(
										buttonVariants({ variant: 'outline' }),
										'w-full justify-start pl-4 text-left font-normal',
										!startDate && 'text-muted-foreground'
									)}
								>
									{startDate ? df.format(startDate.toDate(getLocalTimeZone())) : 'Pick a date'}
									<CalendarIcon class="ml-auto size-4 opacity-50" />
								</Popover.Trigger>
								<Popover.Content class="w-auto p-0" side="top">
									<Calendar
										type="single"
										value={startDate as DateValue}
										minValue={new CalendarDate(1900, 1, 1)}
										calendarLabel="Date of birth"
										onValueChange={(v) => {
											if (v) $formData.startDate = v.toDate(getLocalTimeZone());
										}}
									/>
								</Popover.Content>
							</Popover.Root>
							<Form.FieldErrors />
							<input hidden value={$formData.startDate} name={props.name} />
						{/snippet}
					</Form.Control>
				</Form.Field>
				<Form.Field {form} name="classEndDate">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Class end date</Form.Label>
							<Popover.Root>
								<Popover.Trigger
									{...props}
									class={cn(
										buttonVariants({ variant: 'outline' }),
										'w-full justify-start pl-4 text-left font-normal',
										!classEndDate && 'text-muted-foreground'
									)}
								>
									{classEndDate
										? df.format(classEndDate.toDate(getLocalTimeZone()))
										: 'Pick a date'}
									<CalendarIcon class="ml-auto size-4 opacity-50" />
								</Popover.Trigger>
								<Popover.Content class="w-auto p-0" side="top">
									<Calendar
										type="single"
										value={classEndDate as DateValue}
										minValue={new CalendarDate(1900, 1, 1)}
										calendarLabel="Date of birth"
										onValueChange={(v) => {
											if (v) $formData.classEndDate = v.toDate(getLocalTimeZone());
										}}
									/>
								</Popover.Content>
							</Popover.Root>
							<Form.FieldErrors />
							<input hidden value={$formData.classEndDate} name={props.name} />
						{/snippet}
					</Form.Control>
				</Form.Field>
				<Form.Field {form} name="examPeriodEndDate">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Exam period end date</Form.Label>
							<Popover.Root>
								<Popover.Trigger
									{...props}
									class={cn(
										buttonVariants({ variant: 'outline' }),
										'w-full justify-start pl-4 text-left font-normal',
										!examPeriodEndDate && 'text-muted-foreground'
									)}
								>
									{examPeriodEndDate
										? df.format(examPeriodEndDate.toDate(getLocalTimeZone()))
										: 'Pick a date'}
									<CalendarIcon class="ml-auto size-4 opacity-50" />
								</Popover.Trigger>
								<Popover.Content class="w-auto p-0" side="top">
									<Calendar
										type="single"
										value={examPeriodEndDate as DateValue}
										minValue={new CalendarDate(1900, 1, 1)}
										calendarLabel="Date of birth"
										onValueChange={(v) => {
											if (v) $formData.examPeriodEndDate = v.toDate(getLocalTimeZone());
										}}
									/>
								</Popover.Content>
							</Popover.Root>
							<Form.FieldErrors />
							<input hidden value={$formData.examPeriodEndDate} name={props.name} />
						{/snippet}
					</Form.Control>
				</Form.Field>
			</div>
			<Form.Button class="w-full">Create term</Form.Button>
			<SuperDebug data={$formData} display={dev} />
		</form>
	</Card.Content>
</Card.Root>
