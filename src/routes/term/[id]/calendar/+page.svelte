<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Calendar, DayGrid, Interaction, List, TimeGrid } from '@event-calendar/svelte';
	import type { PageData } from './$types';
	import { toast } from 'svelte-sonner';
	import { Separator } from '$lib/components/ui/separator';
	import { buttonVariants } from '$lib/components/ui/button';
	import { Plus } from 'lucide-svelte';
	import { Input } from '$lib/components/ui/input/index.js';
	import SuperDebug, { dateProxy, superForm } from 'sveltekit-superforms';
	import { formSchema } from './schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { dev } from '$app/environment';
	import { Checkbox } from '$lib/components/ui/checkbox';

	let { data }: { data: PageData } = $props();

	let classEvents = $derived(
		data.schedule.classes.map((courseClass) => ({
			id: courseClass.id,
			title: `${courseClass.courseName} - ${courseClass.name}`,
			start: new Date(courseClass.startTime),
			end: new Date(courseClass.endTime),
			styles: [`background-color: ${courseClass.color}`],
			extendedProps: {
				type: 'class'
			}
		}))
	);

	let taskEvents = $derived(
		data.schedule.tasks.map((task) => ({
			id: task.id,
			title: `${task.courseName} - ${task.name}`,
			start: new Date(task.dueDate),
			end: new Date(task.dueDate),
			allDay: true,
			styles: [`background-color: ${task.color}`],
			extendedProps: {
				type: 'task'
			}
		}))
	);

	let examEvents = $derived(
		data.schedule.exams.map((exam) => ({
			id: exam.id,
			title: `${exam.courseName} - ${exam.name}`,
			start: new Date(exam.date),
			end: new Date(new Date(exam.date).getTime() + exam.length * 60000),
			styles: [`background-color: ${exam.color}`],
			extendedProps: {
				type: 'exam'
			}
		}))
	);

	let activityEvents = $derived(
		data.schedule.activities.map((activityEvent) => ({
			id: activityEvent.id,
			title: activityEvent.activityName,
			start: new Date(activityEvent.startTime),
			end: new Date(activityEvent.endTime),
			styles: [`background-color: ${activityEvent.color}`],
			extendedProps: {
				type: 'activity'
			}
		}))
	);

	async function modifyEvent(event: any) {
		const res = await fetch('/api/schedule', {
			method: 'PUT',
			body: JSON.stringify(event),
			headers: {
				'content-type': 'application/json'
			}
		});

		if (res.status !== 204) {
			toast.error('There was an error while trying to update the event');
			return false;
		}

		return true;
	}

	let options = $derived({
		view: 'timeGridWeek',
		events: [...classEvents, ...taskEvents, ...examEvents, ...activityEvents],
		headerToolbar: {
			start: 'prev,next today',
			center: 'title',
			end: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
		},
		dayMaxEvents: true,
		nowIndicator: true,
		height: '70vh',
		scrollTime: '08:00:00',
		slotDuration: '00:15:00',
		eventDrop: async (info: any) => {
			const eventUpdated = await modifyEvent({
				id: info.event.id,
				start: info.event.start,
				end: info.event.end,
				type: info.event.extendedProps.type
			});

			if (!eventUpdated) info.revert();
		}
	});

	let isModalOpen = $state(false);

	const form = superForm(data.form, {
		validators: zodClient(formSchema),
		onResult: ({ result }) => {
			if (result.status === 204) {
				isModalOpen = false;
				toast.success('Successfully added activity to your calendar');
			}
		}
	});

	const startTimeProxy = dateProxy(form, 'startTime', { format: 'datetime-local' });
	const endTimeProxy = dateProxy(form, 'endTime', { format: 'datetime-local' });

	const { form: formData, enhance } = form;
</script>

<svelte:head>
	<title>Calendar</title>
</svelte:head>

<div class="flex flex-col items-center justify-between gap-4 md:flex-row">
	<div class="space-y-0.5">
		<h2 class="text-2xl font-bold tracking-tight">Calendar</h2>
		<p class="text-muted-foreground">You can find all the events you have for this term here</p>
	</div>
	<AlertDialog.Root bind:open={isModalOpen}>
		<AlertDialog.Trigger class={buttonVariants()} onclick={() => (isModalOpen = true)}
			><Plus />Create new activity</AlertDialog.Trigger
		>
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title>Create new activity</AlertDialog.Title>
				<AlertDialog.Description>Add an activity to your calendar.</AlertDialog.Description>
			</AlertDialog.Header>
			<form method="POST" class="grid gap-4" use:enhance>
				<Form.Field {form} name="activityId">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Activity</Form.Label>
							<select
								{...props}
								class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
								bind:value={$formData.activityId}
							>
								{#each data.activities as activity}
									<option value={activity.id}>{activity.name}</option>
								{/each}
							</select>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<div class="grid grid-cols-1 gap-2 md:grid-cols-2">
					<Form.Field {form} name="startTime">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Start time</Form.Label>
								<Input
									{...props}
									type="datetime-local"
									bind:value={$startTimeProxy}
									class="appearance-none"
								/>
								<Form.FieldErrors />
							{/snippet}
						</Form.Control>
					</Form.Field>
					<Form.Field {form} name="endTime">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>End time</Form.Label>
								<Input
									{...props}
									type="datetime-local"
									bind:value={$endTimeProxy}
									class="appearance-none"
								/>
								<Form.FieldErrors />
							{/snippet}
						</Form.Control>
					</Form.Field>
				</div>
				<Form.Field {form} name="repeatsWeekly">
					<Form.Control>
						{#snippet children({ props })}
							<div class="flex items-center gap-2">
								<Checkbox {...props} bind:checked={$formData.repeatsWeekly} />
								<Form.Label>Repeats weekly</Form.Label>
							</div>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<AlertDialog.Footer>
					<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
					<Form.Button>Add</Form.Button>
				</AlertDialog.Footer>
				<SuperDebug data={form.form} display={dev} />
			</form>
		</AlertDialog.Content>
	</AlertDialog.Root>
</div>
<Separator class="my-8" />
<Calendar plugins={[DayGrid, Interaction, List, TimeGrid]} {options} />
