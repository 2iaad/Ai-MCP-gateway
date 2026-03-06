/**
 *  This server exposes 3 tools to the AI:
 *    1. read_file        – read any file from your file system
 *    2. list_directory   – list what's inside a folder
 *    3. get_library_docs – fetch up-to-date docs from Context7
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// this library lets processes talk using file descriptors stdin & stdout
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// z is used to declare typed input schemas; the SDK converts them to JSON Schema automatically so the AI client knows what to pass.
import { z } from "zod";

// builtin modules f node js
import fs from "fs/promises"; // read write file-system files
import path from "path"; // path helpers

// ─── 1. Create the server ────────────────────────────────────────────────────

const server = new McpServer({ name: "my-mcp-server", version: "1.0.0" });

// ─── 2. Register tools ───────────────────────────────────────────────────────
//
// registerTool(name, { description, inputSchema }, handler)
//   - inputSchema uses Zod; the SDK converts it to JSON Schema for the client
//   - the handler receives validated, fully-typed arguments directly

// ── Tool 1: read_file ─────────────────────────────────────────────────────────
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
		// path.resolve turns relative paths into absolute ones
		const resolvedPath = path.resolve(file_path);

		try {
			// fs.readFile returns the raw bytes; "utf-8" converts them to a string
			const content = await fs.readFile(resolvedPath, "utf-8");

			// MCP tools return an array of "content" blocks.
			// type: "text" (other types: "image", "resource").
			return {
				content: [{ type: "text", text: `File: ${resolvedPath}\n\n${content}` }],
			};
		} catch (err) {
			// If the file doesn't exist or can't be read, tell the AI clearly
			const message = err instanceof Error ? err.message : String(err);
			return {
				content: [{ type: "text", text: `Error reading file: ${message}` }],
				isError: true,
			};
		}
	}
);

// ── Tool 2: list_directory ────────────────────────────────────────────────────
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
					"Absolute path to the directory, e.g. /Users/ziyad/Desktop/my-project"
				),
		},
	},
	async ({ dir_path }) => {
		const resolvedPath = path.resolve(dir_path);

		try {
			// fs.readdir with { withFileTypes: true } returns Dirent objects that
			// tell us whether each entry is a file or a directory
			const entries = await fs.readdir(resolvedPath, { withFileTypes: true });

			// Build a human-readable list  [DIR] folder/  or  [FILE] file.txt
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

// ── Tool 3: get_library_docs ──────────────────────────────────────────────────
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

// ─── 3. Start the server ──────────────────────────────────────────────────────

// StdioServerTransport links the server with stdin/stdout
const transport = new StdioServerTransport();

// starting the event loop
await server.connect(transport);

console.error("MCP server started and ready.");
