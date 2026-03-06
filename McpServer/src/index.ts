/**
 *  My MCP Server
 *  Model Context Protocol (MCP) is a standard that lets AI assistants
 *  talk to external tools and resources.
 *
 *  This server exposes 3 tools to the AI:
 *    1. read_file        – read any file from your file system
 *    2. list_directory   – list what's inside a folder
 *    3. get_library_docs – fetch up-to-date docs from Context7
 */

// The MCP SDK gives us the building blocks for a server
import { Server } from "@modelcontextprotocol/sdk/server/index.js";

// StdioServerTransport lets the server talk over stdin/stdout (standard
// input/output) – the same way a terminal reads & writes text.
// VS Code (or any MCP client) will launch this process and communicate
// through those streams.
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// These schemas tell the SDK which kinds of requests we handle
import {
	CallToolRequestSchema,
	ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// Node.js built-in modules – no installation needed
import fs from "fs/promises"; // async file-system operations
import path from "path"; // safe & cross-platform path helpers

// ─── 1. Create the server ────────────────────────────────────────────────────

// we give "Server" a name and a version so the AI client can identify it.
const server = new Server(
	{ name: "my-mcp-server", version: "1.0.0" },
	{
		capabilities: {
			// We advertise that this server supports "tools".
			// Other capability types exist (resources, prompts, etc.) but tools
			// are the most common – they are functions the AI can call.
			tools: {},
		},
	}
);

// ─── 2. Advertise the tools ───────────────────────────────────────────────────

// When the AI asks "what can you do?", we answer with a list of tools.
// Each tool has:
//   - name        : unique identifier the AI uses when calling it
//   - description : plain-English explanation so the AI knows when to use it
//   - inputSchema : a JSON Schema object that describes the expected arguments
server.setRequestHandler(ListToolsRequestSchema, async () => {
	return {
		tools: [
			// ── Tool 1: read_file ─────────────────────────────────────────────────
			{
				name: "read_file",
				description:
					"Read the full text content of a single file from the local file system. " +
					"Use this to load context files, skill documents, notes, configs, etc.",
				inputSchema: {
					type: "object",
					properties: {
						file_path: {
							type: "string",
							description:
								"Absolute path to the file, e.g. /Users/ziyad/Desktop/notes.md",
						},
					},
					// 'required' lists the arguments that MUST be provided
					required: ["file_path"],
				},
			},

			// ── Tool 2: list_directory ────────────────────────────────────────────
			{
				name: "list_directory",
				description:
					"List all files and sub-folders inside a directory. " +
					"Useful to explore which context/skill files are available before reading them.",
				inputSchema: {
					type: "object",
					properties: {
						dir_path: {
							type: "string",
							description:
								"Absolute path to the directory, e.g. /Users/ziyad/Desktop/my-project",
						},
					},
					required: ["dir_path"],
				},
			},

			// ── Tool 3: get_library_docs ──────────────────────────────────────────
			{
				name: "get_library_docs",
				description:
					"Fetch the latest, version-accurate documentation for any programming library " +
					"or framework using Context7. Always call this before answering questions about " +
					"a specific library so you have current docs instead of stale training data.",
				inputSchema: {
					type: "object",
					properties: {
						library_name: {
							type: "string",
							description:
								"The name of the library / framework to look up, " +
								"e.g. 'react', 'nextjs', 'typescript', 'tailwindcss'.",
						},
						topic: {
							type: "string",
							description:
								"(Optional) A specific topic inside the library docs, " +
								"e.g. 'hooks', 'routing', 'authentication'.",
						},
					},
					required: ["library_name"],
				},
			},
		],
	};
});

// ─── 3. Handle tool calls ─────────────────────────────────────────────────────

// When the AI decides to call one of the tools above, this handler is invoked.
// request.params contains { name, arguments } where:
//   - name      : the tool name chosen by the AI
//   - arguments : the object the AI filled in according to the inputSchema
server.setRequestHandler(CallToolRequestSchema, async (request) => {
	const { name, arguments: args } = request.params;

	// ── Tool 1: read_file ───────────────────────────────────────────────────────
	if (name === "read_file") {
		// Cast to the expected shape (TypeScript needs this because args is unknown)
		const { file_path } = args as { file_path: string };

		// path.resolve turns relative paths into absolute ones, just in case
		const resolvedPath = path.resolve(file_path);

		try {
			// fs.readFile returns the raw bytes; "utf-8" converts them to a string
			const content = await fs.readFile(resolvedPath, "utf-8");

			// MCP tools return an array of "content" blocks.
			// type: "text" means it's plain text (other types: "image", "resource").
			return {
				content: [
					{
						type: "text",
						text: `File: ${resolvedPath}\n\n${content}`,
					},
				],
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

	// ── Tool 2: list_directory ──────────────────────────────────────────────────
	if (name === "list_directory") {
		const { dir_path } = args as { dir_path: string };
		const resolvedPath = path.resolve(dir_path);

		try {
			// fs.readdir with { withFileTypes: true } returns Dirent objects that
			// tell us whether each entry is a file or a directory
			const entries = await fs.readdir(resolvedPath, { withFileTypes: true });

			// Build a human-readable list  📁 folder/  or  📄 file.txt
			const lines = entries.map((entry) =>
				entry.isDirectory() ? `[DIR]  ${entry.name}/` : `[FILE] ${entry.name}`
			);

			return {
				content: [
					{
						type: "text",
						text: `Contents of ${resolvedPath}:\n\n${lines.join("\n")}`,
					},
				],
			};
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			return {
				content: [{ type: "text", text: `Error listing directory: ${message}` }],
				isError: true,
			};
		}
	}

	// ── Tool 3: get_library_docs ────────────────────────────────────────────────
	if (name === "get_library_docs") {
		const { library_name, topic } = args as {
			library_name: string;
			topic?: string;
		};

		try {
			// ── Step A: Search Context7 for the library ID ──────────────────────
			// Context7 uses an internal library ID (e.g. "/vercel/next.js") that we
			// need before we can fetch the actual docs. The search endpoint maps a
			// human-readable name to that ID.
			const searchUrl = `https://context7.com/api/v1/search?query=${encodeURIComponent(library_name)}`;

			// fetch() is built into Node.js 18+, no extra package needed
			const searchResponse = await fetch(searchUrl, {
				headers: {
					// Tell the server we prefer JSON back
					Accept: "application/json",
				},
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

	// If somehow an unknown tool name was called, return an error
	return {
		content: [{ type: "text", text: `Unknown tool: "${name}"` }],
		isError: true,
	};
});

// ─── 4. Start the server ──────────────────────────────────────────────────────

// StdioServerTransport wires the server to stdin/stdout.
// VS Code will launch this process and communicate through those streams.
const transport = new StdioServerTransport();

// connect() starts the event loop – the server will now listen for requests
await server.connect(transport);

// This log goes to stderr (not stdout) so it doesn't corrupt the MCP stream
console.error("MCP server started and ready.");
