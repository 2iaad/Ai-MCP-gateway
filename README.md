# My MCP Server

A local **Model Context Protocol (MCP)** server that uses STDIN/STDOUT to talk with AI agents (MCP clients) to access our file system, context7 API, and macOS Notes app.
> The first 2 tools i created won't be used because vs-code uses its built in tools such as 'list_dir' & 'read_file' instead of using my 'list_directory' & 'read_file'
---

## Tools

| Tool | What it does |
|---|---|
| `read_file` | Reads the full content of any local file |
| `list_directory` | Lists files and folders inside a directory |
| `get_library_docs` | Fetches up-to-date docs from Context7 for any library |
| `count_notes` | Returns how many notes you have in the macOS Notes app |
| `latest_song` | Shows the latest song played on Spotify |

---

## How it works

<div align='center'>
	<img src='DataFlow.png' width=900/>
</div>


---

## Testing latest_song tool

The image below shows the answer received from the MCP server in the chat, displaying the most recent song played on Spotify.
 
<div align='center'>
	<img src='latest_song.png' width=600/>
</div>

---

## Setup

```bash
cd McpServer
npm install
npm run build
```

VS Code auto-starts the server via `.vscode/mcp.json` whenever Copilot Agent connects.
If you have feedback or ideas, feel free to share :)