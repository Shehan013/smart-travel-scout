# Smart Travel Scout

An AI-powered travel recommendation web application that helps users discover personalized Sri Lankan travel experiences. Built with Next.js, TypeScript, and Google Gemini AI, this application demonstrates responsible AI integration with robust validation, safety measures, and a grounding architecture to prevent AI hallucinations.

---

## Questions & Answers

### 1. The "Under the Hood" Moment
**Q: Describe one specific technical hurdle you faced while connecting the AI API to your frontend. How did you debug it?**

**A:** Finding the suitable AI model for the project was a bit challenging. Initially, Copilot suggested using "gemini-1.5-flash", but it was deprecated long time ago. So I referred to the API quickstart documentation of Google AI Studio and compared the available options with support from AI. I found the "gemini-2.5-flash-lite" as the most suitable model for this project, considering it's part of the free tier and optimized for text-only recommendations.

### 2. The Scalability Thought
**Q: If we had 50,000 travel packages instead of 5, how would you change your approach to ensure the AI doesn't get confused or too expensive to run?**

**A:** If there were 50,000 records, directly accessing them using the AI tool for searching would use resources inefficiently. I would prefer to go with an indexing mechanism to reduce lookup time. Also, I think it is better to implement mandatory filters for users to set, such as budget range, country, season, activity type, etc. Then we can limit the data that AI needs to look at, effectively creating a two-stage filtering process: first filter by user constraints, then use AI for semantic matching on a reduced dataset.

Additional considerations for scale:
- Implement pagination or lazy loading for results
- Use caching strategies (Redis) for popular queries
- Implement semantic search with pre-computed embeddings instead of passing all data in prompts

### 3. The AI Reflection
**Q: Which AI tool (ChatGPT, Cursor, Copilot, etc.) did you use to help build this? Share one instance where the AI gave you a bad or buggy suggestion and how you corrected it.**

**A:** I used GitHub Copilot throughout the project.

When connecting the Gemini API and I started testing with the support of Copilot, there were sudden errors mentioning that I had reached usage limits. When debugging, I figured out that on every page refresh/rerender, it was using tokens from my free tier quota. I discussed the issue and ideas with Copilot and figured out that manually running a test script was the best option instead of auto-triggering API calls on component mount. I created a separate test script (`test-gemini-manual.ts`) that runs only when explicitly executed, preventing accidental quota exhaustion during development.

---

##  Tech Stack

### Frontend
- **Next.js 14+** - React framework with App Router and Server Components
- **TypeScript** - Type-safe development with static analysis
- **Tailwind CSS v4** - Utility-first CSS framework
- **React Hooks** - State management and side effects

### Backend & AI
- **Next.js API Routes** - Serverless API endpoints
- **Google Gemini API** - `gemini-2.5-flash-lite` model for AI recommendations
- **Zod v4** - Runtime validation and schema definition
- **Node.js** - Server-side runtime

### Security & Validation
- **Input Sanitization** - Prompt injection prevention
- **ID Validation** - Prevents AI hallucination of non-existent experiences
- **Environment Variable Protection** - Server-side only API key storage
- **Error Handling** - Graceful degradation with fallback recommendations

---

## Project Structure

```
smart-travel-scout/
├── app/
│   ├── api/
│   │   └── recommend/
│   │       └── route.ts          # API endpoint for AI recommendations
│   ├── layout.tsx                 # Root layout with metadata
│   └── page.tsx                   # Main search interface
├── components/
│   ├── ExperienceCard.tsx         # Travel experience display card
│   ├── LoadingSpinner.tsx         # Loading state with logo animation
│   └── SearchFilters.tsx          # Price and tag filter controls
├── data/
│   └── inventory.json             # Travel experience database
├── lib/
│   ├── gemini.ts                  # Gemini API client with grounding
│   ├── inventory.ts               # Data access layer
│   ├── safety.ts                  # Security and validation utilities
│   ├── types.ts                   # TypeScript type definitions
│   ├── utils.ts                   # Formatting and utility functions
│   └── validation.ts              # Zod schemas
├── public/
│   └── images/
│       └── logo.png               # Application logo
└── scripts/
    ├── test-api.js                # API endpoint testing script
    └── test-gemini-manual.ts      # Manual Gemini API testing
```

---

## Setup Instructions

### Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager
- Google Gemini API key ([Get it here](https://aistudio.google.com/app/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd smart-travel-scout
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   
    **Important:** Never use the `NEXT_PUBLIC_` prefix for the API key. This keeps it server-side only for security.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## Testing

### Manual Gemini API Test
```bash
npx ts-node scripts/test-gemini-manual.ts
```

### API Endpoint Test
```bash
node scripts/test-api.js
```

---

## Deployment

This project is optimized for deployment on **Vercel**:

1. Push your code to GitHub
2. Import the project to [Vercel](https://vercel.com)
3. Add the `GEMINI_API_KEY` environment variable in Vercel project settings
4. Deploy!

Vercel will automatically detect Next.js and configure the build settings.

---

## Key Features

### AI-Powered Recommendations
- Natural language search queries
- Semantic matching with user intent
- Explanation of why experiences are recommended

### Grounding Architecture
- Full inventory included in system prompt
- Prevents AI from inventing non-existent experiences
- Validates all returned IDs against actual inventory

### Advanced Filtering
- Dual-range price slider (min/max)
- Tag-based filtering (beach, adventure, history, etc.)
- Real-time filter application

### Safety Measures
- Input sanitization to prevent prompt injection
- ID validation to catch hallucinations
- Fallback recommendations for error scenarios
- Environment validation on startup

### User Experience
- Responsive design for mobile and desktop
- Loading states with animated spinner
- Error handling with user-friendly messages
- Empty state guidance

---

## Learning Outcomes

This project demonstrates:
- **TypeScript Proficiency**: Interfaces, type inference, generic types, and compile-time safety
- **AI Integration**: Prompt engineering, grounding techniques, and hallucination prevention
- **API Security**: Server-side API key management, input validation, and rate limiting considerations
- **Modern React**: Server and client components, hooks, async/await patterns
- **Validation Patterns**: Runtime validation with Zod, multi-layer defense strategies
- **Production Readiness**: Error handling, logging, environment configuration, deployment

---

## License

MIT License - feel free to use this project for learning and assessment purposes.

---

## Acknowledgments

Built as part of an assessment with a focus on responsible AI usage and best practices.
