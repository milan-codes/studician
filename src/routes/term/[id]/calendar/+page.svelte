<script lang="ts">
	import { Calendar, DayGrid, Interaction, List, TimeGrid } from '@event-calendar/svelte';
	import type { PageData } from './$types';
	import { toast } from 'svelte-sonner';

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
		events: [...classEvents, ...taskEvents, ...examEvents],
		headerToolbar: {
			start: 'prev,next today',
			center: 'title',
			end: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
		},
		dayMaxEvents: true,
		nowIndicator: true,
		height: '80vh',
		scrollTime: '06:00:00',
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
</script>

<Calendar plugins={[DayGrid, Interaction, List, TimeGrid]} {options} />
