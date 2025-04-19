<script lang="ts">
	import { Calendar, DayGrid, Interaction, List, TimeGrid } from '@event-calendar/svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let classEvents = $derived(
		data.schedule.classes.map((courseClass) => ({
			id: courseClass.id,
			title: `${courseClass.courseName} - ${courseClass.name}`,
			start: new Date(courseClass.startTime),
			end: new Date(courseClass.endTime),
			styles: [`background-color: ${courseClass.color}`]
		}))
	);

	let taskEvents = $derived(
		data.schedule.tasks.map((task) => ({
			id: task.id,
			title: `${task.courseName} - ${task.name}`,
			start: new Date(task.dueDate),
			allDay: true,
			styles: [`background-color: ${task.color}`]
		}))
	);

	let examEvents = $derived(
		data.schedule.exams.map((exam) => ({
			id: exam.id,
			title: `${exam.courseName} - ${exam.name}`,
			start: new Date(exam.date),
			end: new Date(new Date(exam.date).getTime() + exam.length * 60000),
			styles: [`background-color: ${exam.color}`]
		}))
	);

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
		slotDuration: '00:15:00'
	});
</script>

<Calendar plugins={[DayGrid, Interaction, List, TimeGrid]} {options} />
