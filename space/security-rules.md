# Security Rules

> Hard rules the AI must always follow when generating code for this project.

---

## Never do this

- ❌ Expose stack traces or internal errors to API responses
- ❌ Log passwords, tokens, or any PII
- ❌ Build SQL queries with string concatenation (use parameterized queries)
- ❌ Trust user input without validation
- ❌ Hardcode credentials, API keys, or secrets anywhere in code

## Always do this


- ✅ Validate and sanitize all user input before using it
- ✅ Use environment variables for secrets (`process.env.X`)
- ✅ Return generic error messages to the client (log details server-side only)
- ✅ Check authentication and authorization before any data access
- ✅ Use HTTPS — never send sensitive data over HTTP

## Auth rules

- [e.g. All routes except /login and /register require a valid JWT]
- [e.g. Refresh tokens must be stored in httpOnly cookies, not localStorage]

## Data rules

- [e.g. Never return password hashes in API responses]
- [e.g. Scope DB queries to the authenticated user's ID]
