#!/bin/sh

/bin/ollama serve &

pid=$!

sleep 5

ollama pull gemma3:1b

wait $pid
