# Babel for Spreadsheets

A proof of concept for Babel to test the feasibility of efficient spreadsheet translation with babel like context preservation through pre-analysis.

## Features

- **Row-by-row Translation**: Processes spreadsheets in batches of 10 rows for efficiency
- **Context Awareness**: Pre-analyzes data to understand domain, style, and terms to preserve
- **Smart Column Detection**: Automatically identifies text columns vs numeric columns
- **Auto-detect Source Language**: Supports automatic language detection
- **Progress Tracking**: Real-time progress with retry logic and error handling
- **Error Handling**: Automatically retries failed batches (up to 3 times) and aborts after 3 consecutive failures

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom "Terminal Warmth" design
- **LLM**: DeepSeek via Vercel AI SDK
- **CSV Parsing**: PapaParse

## Sample Data

A `sample.csv` file with Japanese product data is included for testing.

## Architecture

### Components

- **FileUpload**: Drag-drop CSV upload
- **DataPreview**: Table preview of uploaded data
- **TranslationConfig**: Language and column selection
- **TranslationProgress**: Real-time progress tracking
- **DownloadResult**: Preview and download translated CSV

### State Management

Uses a reducer pattern (`useTranslation` hook) to manage:
- Upload → Analysis → Translation → Complete flow
- Batch progress and retry logic
- Error tracking and consecutive failure detection

### API Routes

- `/api/analyze`: Pre-analyzes sample rows to extract context
- `/api/translate`: Translates batches of rows with context

## Configuration

Edit `lib/constants.ts` to adjust:

- `BATCH_SIZE`: Rows per batch (default: 10)
- `MAX_RETRIES`: Retry attempts per batch (default: 3)
- `MAX_CONSECUTIVE_FAILURES`: Abort threshold (default: 3)
- `RATE_LIMIT_DELAY`: Delay between API calls in ms (default: 200)


## Possible Enhancements to make before integrating with Babel

- Excel file support (.xlsx)
- Rolling glossary integration
- Multiple LLM provider support (Gemini, OpenAI)
- Batch size optimization based on content
- Recovery from failure
- Resume failed translations
- Translation memory/cache
