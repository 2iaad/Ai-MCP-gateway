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
	async ({ file_path }) => {
		const resolvedPath = path.resolve(file_path); // convert relative paths into absolute ones

		try {
			console.error("salam from read_file!");

			const content = await fs.readFile(resolvedPath, "utf-8"); // returns the raw bytes & "utf-8" converts them to a string

			// type: "text" or "image" or "resource"
			return {
				content: [{ type: "text", text: `File: ${resolvedPath}\n\n${content}` }],
			};
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			return {
				content: [{ type: "text", text: `Error reading file: ${message}` }],
				isError: true,
			};
		}
	}
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
	async ({ dir_path }) => {
		console.error("salam from list_directory!");
		const resolvedPath = path.resolve(dir_path);

		try {
			// withFileTypes: true returns objects that tells if each element is a file or a directory
			const entries = await fs.readdir(resolvedPath, { withFileTypes: true });

			const lines = entries.map((entry) =>
				entry.isDirectory() ? `[DIR]  ${entry.name}/` : `[FILE] ${entry.name}`
			);

			return {
				content: [{ type: "text", text: `Contents of ${resolvedPath}:\n\n${lines.join("\n")}` }]
			};
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			return {
				content: [{ type: "text", text: `Error listing directory: ${message}` }],
				isError: true,
			};
		}
	}
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
	async ({ library_name, topic }) => {
		try {
			// ── Step A: Search Context7 for the library ID ──────────────────────
			// Context7 uses an internal library ID (e.g. "/vercel/next.js") that we
			// need before we can fetch the actual docs. The search endpoint maps a
			// human-readable name to that ID.
			const searchUrl = `https://context7.com/api/v1/search?query=${encodeURIComponent(library_name)}`;

			// fetch() is built into Node.js 18+, no extra package needed
			const searchResponse = await fetch(searchUrl, {
				headers: { Accept: "application/json" },
			});

			if (!searchResponse.ok) {
				throw new Error(
					`Context7 search failed with status ${searchResponse.status}`
				);
			}

			// The response body is JSON; .json() parses it
			const searchData = (await searchResponse.json()) as {
				results?: Array<{ id: string; title: string; description: string }>;
			};

			// If nothing was found, return a friendly message
			if (!searchData.results || searchData.results.length === 0) {
				return {
					content: [
						{
							type: "text",
							text: `No documentation found for "${library_name}" on Context7.`,
						},
					],
				};
			}

			// Pick the first (most relevant) result
			const bestMatch = searchData.results[0];

			// ── Step B: Fetch the actual documentation ───────────────────────────
			// Build the docs URL. We request up to 8000 tokens of content.
			// If a topic was provided, pass it as a query param to get focused docs.
			const docsParams = new URLSearchParams({ tokens: "8000" });
			if (topic) docsParams.set("topic", topic);

			const docsUrl = `https://context7.com/api/v1${bestMatch.id}?${docsParams}`;

			const docsResponse = await fetch(docsUrl, {
				headers: { Accept: "text/plain" },
			});

			if (!docsResponse.ok) {
				throw new Error(
					`Context7 docs fetch failed with status ${docsResponse.status}`
				);
			}

			// Docs come back as plain text (Markdown)
			const docsText = await docsResponse.text();

			return {
				content: [
					{
						type: "text",
						text:
							`# ${bestMatch.title} – Documentation from Context7\n\n` +
							(topic ? `**Topic:** ${topic}\n\n` : "") +
							docsText,
					},
				],
			};
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			return {
				content: [
					{
						type: "text",
						text: `Error fetching docs from Context7: ${message}`,
					},
				],
				isError: true,
			};
		}
	}
);

server.registerTool(
	"count_notes",
	{
		description:
			"Returns the total number of notes stored in the macOS Notes app. " +
			"Use this when the user asks how many notes they have.",
		inputSchema: {},
	},
	async () => {
		try {
			console.error("salam from count_notes!");
			const { stdout } = await execFileAsync("osascript", [
				"-e",
				'tell application "Notes" to return count of notes',
			]);
			const count = stdout.trim();
			return {
				content: [{ type: "text", text: `You have ${count} note(s) in the Notes app.` }],
			};
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			return {
				content: [{ type: "text", text: `Error accessing Notes app: ${message}` }],
				isError: true,
			};
		}
	}
);

const transport = new StdioServerTransport(); // linking the server with stdin/stdout to communicate with MCP client (co-kilot)

await server.connect(transport);

console.error("MCP server running!");
