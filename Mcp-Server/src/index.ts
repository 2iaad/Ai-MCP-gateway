/**
 *  This server exposes 4 tools to the AI:
 *    1. read_file        – read any file from your file system
 *    2. list_directory   – list what's inside a folder
 *    3. get_library_docs – fetch up-to-date docs from Context7
 *    4. count_notes – return how many notes i have in my Notes app
 * 
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
// this library lets processes talk using file descriptors stdin & stdout
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fs from "fs/promises"; // read write file-system files
import path from "path"; // path helpers
import { execFile } from "child_process"; // run shell commands
import { promisify } from "util";

import { readFileCallback, listDirectoryCallback, getLibraryDocsCallback, countNotesCallback, latestSongCallback } from "./callBacks.js";

const execFileAsync = promisify(execFile);
const server = new McpServer({ name: "my-mcp-server", version: "1.0.0" });

/**
 * 
 * registerTool(name, { description, inputSchema }, handler)
 *   - inputSchema use Zod -> SDK converts it to JSON Schema for the client
*/

server.registerTool(
	"read_file",
	{
		description:
			"Read the full text content of a single file from the local file system. \
			Use this to load context files, skill documents, notes, configs, etc.",
		inputSchema: {
			file_path: z
				.string()
				.describe("Absolute path to the file, e.g. /Users/ziyad/Desktop/notes.md"),
		},
	},
	readFileCallback
);

server.registerTool(
	"list_directory",
	{
		description:
			"List all files and sub-folders inside a directory. " +
			"Useful to explore which context/skill files are available before reading them.",
		inputSchema: {
			dir_path: z
				.string()
				.describe(
					"Absolute path to the directory, e.g. /Users/ziyad/Desktop"
				),
		},
	},
	listDirectoryCallback
);

server.registerTool(
	"get_library_docs",
	{
		description:
			"Fetch the latest, version-accurate documentation for any programming library " +
			"or framework using Context7. Always call this before answering questions about " +
			"a specific library so you have current docs instead of stale training data.",
		inputSchema: {
			library_name: z
				.string()
				.describe(
					"The name of the library / framework to look up, " +
					"e.g. 'react', 'nextjs', 'typescript', 'tailwindcss'."
				),
			topic: z
				.string()
				.optional()
				.describe(
					"(Optional) A specific topic inside the library docs, " +
					"e.g. 'hooks', 'routing', 'authentication'."
				),
		},
	},
	getLibraryDocsCallback
);

server.registerTool(
	"count_notes",
	{
		description:
			"Returns the total number of notes stored in the macOS Notes app. " +
			"Use this when the user asks how many notes they have.",
		inputSchema: {},
	},
	countNotesCallback
);

server.registerTool(
	"latest_song",
	{
		description: "gets the latest song played on the macOS Spotify application." +
			"Use this when the user asks for the lastest streamed song",
		inputSchema: {},
	},
	latestSongCallback
)

const transport = new StdioServerTransport(); // linking the server with stdin/stdout to communicate with MCP client (co-kilot)
await server.connect(transport);
console.error("MCP server running!");
