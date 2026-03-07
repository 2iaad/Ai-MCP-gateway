import path from "path";
import fs from "fs/promises";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

export const readFileCallback = async ({ file_path }: { file_path: string }) => {
	const resolvedPath = path.resolve(file_path);
	try {
		console.error("salam from read_file!");
		const content = await fs.readFile(resolvedPath, "utf-8");
		return {
			content: [{ type: "text" as const, text: `File: ${resolvedPath}\n\n${content}` }],
		};
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		return {
			content: [{ type: "text" as const, text: `Error reading file: ${message}` }],
			isError: true,
		};
	}
};

export const listDirectoryCallback = async ({ dir_path }: { dir_path: string }) => {
	console.error("salam from list_directory!");
	const resolvedPath = path.resolve(dir_path);
	try {
		const entries = await fs.readdir(resolvedPath, { withFileTypes: true });
		const lines = entries.map((entry) =>
			entry.isDirectory() ? `[DIR]  ${entry.name}/` : `[FILE] ${entry.name}`
		);
		return {
			content: [{ type: "text" as const, text: `Contents of ${resolvedPath}:\n\n${lines.join("\n")}` }]
		};
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		return {
			content: [{ type: "text" as const, text: `Error listing directory: ${message}` }],
			isError: true,
		};
	}
};

export const getLibraryDocsCallback = async ({ library_name, topic }: { library_name: string; topic?: string }) => {
	try {
		const searchUrl = `https://context7.com/api/v1/search?query=${encodeURIComponent(library_name)}`;
		const searchResponse = await fetch(searchUrl, {
			headers: { Accept: "application/json" },
		});
		if (!searchResponse.ok) {
			throw new Error(
				`Context7 search failed with status ${searchResponse.status}`
			);
		}
		const searchData = (await searchResponse.json());
		if (!searchData.results || searchData.results.length === 0) {
			return {
				content: [
					{
						type: "text" as const,
						text: `No documentation found for \"${library_name}\" on Context7.`,
					},
				],
			};
		}
		const bestMatch = searchData.results[0];
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
		const docsText = await docsResponse.text();
		return {
			content: [
				{
					type: "text" as const,
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
					type: "text" as const,
					text: `Error fetching docs from Context7: ${message}`,
				},
			],
			isError: true,
		};
	}
};

export const countNotesCallback = async () => {
	try {
		console.error("salam from count_notes!");
		const { stdout } = await execFileAsync("osascript", [
			"-e",
			'tell application "Notes" to return count of notes',
		]);
		const count = stdout.trim();
		return {
			content: [{ type: "text" as const, text: `You have ${count} note(s) in the Notes app.` }],
		};
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		return {
			content: [{ type: "text" as const, text: `Error accessing Notes app: ${message}` }],
			isError: true,
		};
	}
};

export const latestSongCallback = async () => {
	try {
		console.error("salam from lastest_song!");
		const { stdout } = await execFileAsync("osascript", [
			"-e",
			'tell application "Spotify" to return name of current track',
		]);
		const song = stdout.trim();
		return {
			content: [{ type: "text" as const, text: `The latest song played on Spotify is: ${song}` }],
		};
	} catch (err){
		const message = err instanceof Error ? err.message : String(err);
		return {
			content: [{ type: "text" as const, text: `Error accessing Spotify app: ${message}` }],
			isError: true,
		};
	}
};
