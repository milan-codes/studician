#!/bin/sh

bun db:migrate

bun --bun ./build/index.js