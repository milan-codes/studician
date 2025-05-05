<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { buttonVariants } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
</script>

<AlertDialog.Root>
	<AlertDialog.Trigger class={cn(buttonVariants({ variant: 'destructive' }), 'w-full')}
		>Delete term</AlertDialog.Trigger
	>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete the term, as well as all of its
				data, such as courses, tasks, exams and notes.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<form method="POST" action="?/delete">
				<AlertDialog.Action class={buttonVariants({ variant: 'destructive' })}>
					Delete
				</AlertDialog.Action>
			</form>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
