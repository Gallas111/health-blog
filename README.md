This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 🤖 Automated Daily Content Generation

This project includes a **GitHub Actions Workflow** that automatically generates and publishes high-quality AI tutorials every day.

### How it works
1.  **Schedule**: Runs daily at **09:00 KST** (00:00 UTC).
2.  **Topic Selection**: Randomly selects a target category (`ChatGPT`, `Claude`, `AI Automation`, `SEO`, `Blogging`) and asks GPT-4o to suggest a *new* high-demand tutorial topic.
3.  **Content Creation**: Generates a structured Markdown post with:
    -   Internal Links (Series Header, Contextual Links, "Further Reading" section).
    -   AI-generated Images (DALL-E 3 Thumbnail + Pollinations Body Images).
4.  **Deployment**: Commits the new post to the repository, triggering a Vercel deployment.

### Setup (Required)
To enable this, you must add the following **Secret** to your GitHub Repository settings:

1.  Go to `Settings` > `Secrets and variables` > `Actions`.
2.  Click `New repository secret`.
3.  Name: `OPENAI_API_KEY`
4.  Value: Your OpenAI API Key (starting with `sk-...`).

