# Telegram Learning Assistant

An n8n-powered Telegram bot that summarises any learning resource from a URL and quizzes you on it.

---

## Commands

| Command        | Description                                 |
| -------------- | ------------------------------------------- |
| `/start`       | Show welcome message and available commands |
| `/learn <url>` | Submit a URL to learn from                  |
| `/quiz`        | Show your saved topics and start a quiz     |

---

## How to Use

### 1. Start the bot

Send `/start` to get a welcome message and a list of commands.

### 2. Submit a learning resource

```
/learn https://example.com/some-article
```

The bot will fetch the page, summarise the content using AI, and save it as a topic. You will receive a summary with key concepts.

### 3. Take a quiz

```
/quiz
```

The bot replies with your saved topics as inline buttons. Tap a topic to begin. The bot generates 5 multiple-choice questions from the material and sends them one at a time — tap your answer.

- **Correct answer** — the bot moves to the next question.
- **Wrong answer** — the bot explains why and moves on.

### 4. See your results

After all questions are answered the bot sends your final score as a percentage (e.g. **Score: 4/5 (80%)**).

---

## Setup (for self-hosting)

1. Import `Telegram Learning Assistant.json` into your n8n instance.
2. Add your credentials:
   - **Telegram** — create a bot via [@BotFather](https://t.me/BotFather) and paste the token.
   - **OpenAI** — add your API key.
   - **Supabase** — add your project URL and anon key; create the required tables (see schema below).
3. Activate the workflow. The Telegram webhook registers automatically.

### Required Supabase tables

**`materials`** — `id`, `userId`, `url`, `summary`, `createdAt`

**`quiz`** — `id`, `userId`, `materialId`, `questionId`, `question`, `options`, `correctAnswerIdx`, `isCorrect`, `answeredAt`, `createdAt`, `updatedAt`
