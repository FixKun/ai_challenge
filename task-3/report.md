# Task-3 Development Report — Telegram Learning Assistant

## Overview

An n8n workflow powering a Telegram bot that lets users submit a URL to a learning resource, receive an AI-generated summary, and then take an auto-generated quiz on the material. Results are stored per-user and tracked across sessions.

---

## Tools and Techniques

**n8n (Cloud)** — entire orchestration layer. All logic, branching, HTTP calls, and data persistence are expressed as connected nodes in a single workflow. No separate backend server was written.

**Telegram Bot API** — entry point and output channel. The workflow is triggered by a `telegramTrigger` node listening for both `message` and `callback_query` events, covering text commands and inline button presses.

**OpenAI (GPT-4o via n8n LangChain nodes)** — three separate agent/model instances:

- **Teacher Agent** — receives scraped page text, returns a structured summary and key concepts.
- **Examiner Agent** — receives the same material and returns a set of multiple-choice questions with correct answers and explanations.
- **Explainer** — triggered after a wrong answer to generate a contextual explanation.

Structured output parsers (`outputParserStructured`) were attached to the Teacher and Examiner agents to enforce a consistent JSON schema on LLM output.

**Supabase (Data Tables)** — used for all persistence: saved materials, generated quiz questions per user, and per-answer records (`quiz` table with `materialId`, `questionId`, `userId`, `correctAnswerIdx`, `isCorrect`, `answeredAt`).

**HTTP Request nodes** — used directly against the Telegram Bot API for `sendMessage` with `reply_markup` (inline keyboards), bypassing the built-in Telegram node where full control over the request body was needed.

**Code nodes (JavaScript)** — glue logic throughout: parsing callback data (`answer_<topicId>_<questionId>_<chosenIdx>`), converting option letter strings to 0-based indices, splitting option strings, building `reply_markup` JSON, filtering unanswered questions, and computing quiz scores.

---

## What Worked

- **Structured output parsers** made LLM output reliable. Without them, JSON parsing from raw agent text was fragile; once the schema was enforced, downstream nodes received consistent objects every time.
- **HTTP Request node for Telegram** gave full control over `reply_markup`, which the native Telegram node abstracted poorly for inline keyboards with dynamic button counts.

---

## What Did Not Work

- **Native Telegram node does not support dynamic inline keyboards** — the built-in "Send Message" Telegram node has no way to pass a variable number of inline buttons at runtime. It expects a static configuration. Switched to an HTTP Request node calling `sendMessage` directly with a manually built `reply_markup` JSON string, which gave full control over button count and `callback_data` values.

---

## Notable Decisions

- **Questions stored per-user at quiz start** rather than generated on demand per question. This avoids re-running the Examiner Agent mid-quiz if the user is slow to answer, and gives a stable question set for the session.
- **`answeredAt` over a separate `status` column** — a single timestamp covers three states: null (unanswered), set + `isCorrect = true` (correct), set + `isCorrect = false` (wrong). No enum or extra column needed.
- **Inline keyboard buttons carry the answer index**, not a letter. The Examiner Agent returns `correctAnswer` as a letter (`"B"`), which is converted to a 0-based index (`charCodeAt(0) - 65`) before storage, matching Telegram's `correct_option_id` convention and making comparison arithmetic in the validation step straightforward.
- **Telegram bot token obfuscated in the workflow export** — n8n Cloud's free tier does not support environment variables, and the exported JSON contains credentials in plain text. The bot token was manually replaced with the placeholder `<TOKEN>` before committing the file to the repository.
