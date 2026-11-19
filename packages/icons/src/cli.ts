#!/usr/bin/env node
import process from 'node:process'
import { runCli } from './vite/cli.ts'

process.exitCode = await runCli(process.argv.slice(2))
