<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Separator } from '$lib/components/ui/separator';
	import { Send } from 'lucide-svelte';
	import { Chat } from '@ai-sdk/svelte';

	let chatContainer: HTMLUListElement | null;
	const chat = new Chat();

	$effect(() => {
		if (chat.messages.length)
			chatContainer?.scroll({ top: chatContainer.scrollHeight, behavior: 'smooth' });
	});
</script>

<svelte:head>
	<title>Ask AI</title>
</svelte:head>

<div class="flex flex-col items-center justify-between gap-4 md:flex-row">
	<div class="space-y-0.5">
		<h2 class="text-2xl font-bold tracking-tight">Ask AI</h2>
		<p class="text-muted-foreground">
			Your account includes access to a small LLM, go ahead and ask your questions here
		</p>
	</div>
</div>
<Separator class="my-8" />
<ul
	bind:this={chatContainer}
	class="flex max-h-[65vh] min-h-32 flex-col gap-4 overflow-y-auto rounded-md border bg-background px-3 py-2 text-base"
>
	{#each chat.messages as message, messageIndex (messageIndex)}
		{#if message.role === 'assistant'}
			<li class="flex flex-col items-start">
				<div>Assistant</div>
				<div>
					{#each message.parts as part, partIndex (partIndex)}
						{#if part.type === 'text'}
							<div
								class="w-fit rounded-md border bg-secondary px-3 py-2 text-base text-secondary-foreground"
							>
								{part.text}
							</div>
						{/if}
					{/each}
				</div>
			</li>
		{:else if message.role === 'user'}
			<li class="flex flex-col items-end">
				<div>You</div>
				<div>
					{#each message.parts as part, partIndex (partIndex)}
						{#if part.type === 'text'}
							<div
								class="w-fit rounded-md border bg-primary px-3 py-2 text-base text-primary-foreground"
							>
								{part.text}
							</div>
						{/if}
					{/each}
				</div>
			</li>
		{/if}
	{/each}
</ul>
<form onsubmit={chat.handleSubmit} class="my-4 flex gap-4">
	<Input bind:value={chat.input} />
	<Button type="submit"><Send /> Send</Button>
</form>
