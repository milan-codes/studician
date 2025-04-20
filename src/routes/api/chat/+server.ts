import { OLLAMA_URL } from '$env/static/private';
import { streamText } from 'ai';
import { createOllama } from 'ollama-ai-provider';

const ollama = createOllama({
	baseURL: OLLAMA_URL
});

export async function POST({ request }) {
	const { messages } = await request.json();

	const result = streamText({
		model: ollama('gemma3:1b'),
		messages
	});

	return result.toDataStreamResponse();
}
