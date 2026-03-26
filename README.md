# Village Economy — Hackonomics

> *"You didn't wake up to rule. You woke up to decide."*

**Village Economy** is an interactive visual novel and economic simulation game built for Hackonomics. You play as a newly reincarnated village chief advised by a talking donkey named Li (Prophet), and face ten sequential economic crises — each built around a real concept from micro and macroeconomics. Every decision is permanent, morally ambiguous, and has cascading effects on your village's GDP, CPI, unemployment, happiness, and population.

The game ends by profiling your economic ideology: are you a Keynesian macro-architect, an Austrian free-market believer, a Marxist equality guardian, or simply a pragmatist? Fully playable in **Chinese (中文)** and **English**.

---

## Table of Contents

- [Features](#features)
- [Gameplay](#gameplay)
- [The Ten Economic Events](#the-ten-economic-events)
- [Endings](#endings)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Getting Started](#getting-started)
- [Game Systems](#game-systems)
- [Achievement System](#achievement-system)
- [Language Support](#language-support)
- [Design Philosophy](#design-philosophy)

---

## Features

- **Visual novel narrative** — cinematic opening sequence, emoji-based character portraits, and a full RPG-style dialogue engine
- **10 economic events** spanning opportunity cost, diminishing marginal utility, negative externalities, creative destruction, inflation, monopoly, the paradox of thrift, taxation, comparative advantage, and currency warfare
- **Real macroeconomics engine** — GDP (expenditure approach), CPI (money-supply/productivity ratio), unemployment (labor market model), and daily ticks with compound interactions
- **Live villager swarm** — 20 animated NPCs walk, starve, and die based on your stats in real time
- **30 achievements** — each is a named economic concept with a philosophical commentary
- **3 possible endings** — a true good ending, two bad endings, and a secret philosophical ending
- **Bilingual** — full Chinese/English support with a single toggle button; all dialogue, UI, crisis alerts, and daily messages switch instantly
- **Persistent save** — auto-saves to `localStorage` after every action; resumes exactly where you left off

---

## Gameplay

### Title Screen
The game opens with a fully voiced-style cutscene. You wake up in a dark room, hear three aunties debating whether your brain is broken, and then a donkey fills the screen and tells you the village is about to collapse. You are its new chief.

### Idle / Sandbox Phase
Between story events the game enters **idle mode** — a dual-panel management screen:

| Left Panel — Daily Actions (1 AP each) | Right Panel — Construction (3 AP each) |
|---|---|
| ⛏️ Forced Mobilization (+20 productivity, −10 happiness) | 🌾 Farm — +8 food/day |
| 🪩 Village Rave (+20 happiness, −20 productivity) | 🐄 Pasture — +4 food/day |
| 🖨️ Print Money (+¥2000, unlocked after Event 5) | 📜 Academy — +tech multiplier |
| | 🛒 Market — +¥150/day income |
| | ⚒️ Mine — large daily tax revenue |

Each day you start with **3 Action Points**. Spend them, then click **Next Day** to run the daily economic tick. Building infrastructure also determines which crisis events fire.

### Daily Tick
Each day automatically:
1. Calculates food production (foraging + farms + pastures) and consumption
2. Starves the village if food goes negative (deaths = ⌈deficit / 1.5⌉)
3. Computes income modified by happiness, market level, mine level, and tech
4. Recalculates GDP, CPI, and unemployment from first principles
5. Checks for immigration, inflation crises, and riot conditions
6. Dispatches the next story event if its trigger condition is met

### Story Events
Events interrupt the idle loop with a full-screen crisis alert showing the shock effects, then drop you into a multi-character dialogue scene that ends with an A / B / C choice. Your choice permanently alters stats and unlocks an achievement.

---

## The Ten Economic Events

Each event fires once, in order of infrastructure and day progression. No choice is "correct" — every option maps cleanly to a real economic school of thought.

| # | Title | Economic Concept | Trigger |
|---|-------|-----------------|---------|
| 1 | **The Weight of Survival** | Scarcity & Opportunity Cost | Game start |
| 2 | **The Temptation of Meat** | Diminishing Marginal Utility | First Pasture built |
| 3 | **The Blackened River** | Negative Externalities & Tragedy of the Commons | Farm + Pasture + Academy all built |
| 4 | **The Roar of Machines** | Creative Destruction & Structural Unemployment | First Academy built |
| 5 | **The Bottleneck of Commerce** | Fiat Money, Inflation & Quantitative Easing | First Market built |
| 6 | **The Fangs of Capital** | Monopoly & Price Controls | First Mine built |
| 7 | **Winter and Silence** | Paradox of Thrift & Keynesian Stimulus | Days 6–15 (random) |
| 8 | **The Shadow of Plague** | Progressive Tax, Poll Tax & the Free Rider Problem | After 7 events complete |
| 9 | **The Foreign Dumping** | Comparative Advantage & Protectionism | After Event 8 |
| 10 | **Currency War** | Competitive Devaluation & Monetary Union | After Event 9 |

### Sample Event — Event 1: The Weight of Survival

> The granary has 18 kg of wheat. There are 20 villagers. Everyone needs at least 1 kg to survive.

| Choice | School | Effect |
|--------|--------|--------|
| **A — Equal Distribution** (0.9 kg each) | Marxist / Egalitarian | −15 productivity, −50 GDP. Achievement: *Shared Hardship* |
| **B — Prioritize Workers** (elders and children get nothing) | Neoclassical / Utilitarian | −2 population, −25 happiness, +10 productivity. Achievement: *Optimal Solution?* |
| **C — No Intervention** (villagers fight for themselves) | Austrian / Laissez-faire | −1 population, −10 happiness, −10 productivity. Achievement: *Freedom or Evasion* |

After every event, Li the donkey delivers a short economics lesson — naming the concept, explaining why every path had a cost.

---

## Endings

### ✅ True Ending — *The Watcher of Era*
Complete all ten events. The epilogue reflects on your accumulated decisions and profiles your economic ideology. Achievement: *The Watcher of Era (时代的守望者)*.

### 💀 Bad Ending 1 — *A Ghost Town*
Population reaches zero from starvation. The village falls silent. Achievement: *A Ghost Town (死寂之村)*.

### 💀 Bad Ending 2 — *The Fall of a Tyrant*
Happiness reaches zero. Villagers storm the office with torches and pitchforks. Achievement: *The Fall of a Tyrant (独裁者的末日)*.

### 🌾 Secret Ending — *The Gift of Being Unremarkable*
Click **Clear Memory** on the title screen instead of starting the game. A slow cinematic plays out as you relinquish understanding of the world, live a simple life, and grow old. Achievement: *The Gift of Being Unremarkable (平庸之赐)*.

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + inline CSS keyframes |
| State | React `useState` + `localStorage` |
| Fonts | Geist Sans / Geist Mono (Google Fonts) |
| Runtime | Node.js, React 19 |

No external game engine, no Redux, no animation library — all systems built from scratch in ~1 200 lines of TypeScript.

---

## Project Architecture

```
Hackonomics/
└── village-economy/
    └── src/
        ├── app/
        │   ├── layout.tsx          # Root layout — wraps children in LanguageProvider
        │   ├── page.tsx            # Title screen + RPG intro cutscene
        │   └── game/
        │       └── page.tsx        # Main game loop (dialogue, choices, idle sandbox)
        ├── lib/
        │   ├── nodes.ts            # All NODES definitions, GameStats type, INITIAL_STATS
        │   ├── engine.ts           # processDailyTick(), applyEffects(), recalculateMacroEconomics()
        │   ├── gameState.ts        # GameState / Achievement types, clampStats()
        │   ├── storage.ts          # localStorage save / load / clear
        │   ├── language.tsx        # React language context + useLanguage() hook
        │   └── translations.ts     # All bilingual text (UI, nodes, achievements, crisis, engine messages)
        └── components/
            ├── TopBar.tsx          # HUD stat pills + language toggle + log/new-game buttons
            ├── VillagerSwarm.tsx   # Orchestrates 20 walking NPC actors
            ├── Villager.tsx        # Individual NPC: walks → starves → dies
            ├── LogDrawer.tsx       # Sliding event log timeline
            ├── AchievementToast.tsx# Pop-up notification on achievement unlock
            └── AvatarPlaceholder.tsx # 140 px emoji portrait + speaker label
```

### Core Data Flow

```
NODES (nodes.ts)                    ← all narrative content lives here
  └─ Node types: dialogue | choice | idle | narration | achievement | title_secret
       ↓ player picks A / B / C
applyEffects() (engine.ts)          ← mutates GameStats
  ├─ add / set / log / achievement / goto
  ├─ clampStats()                   ← enforces min/max bounds
  └─ recalculateMacroEconomics()    ← GDP, CPI, unemployment from scratch
       ↓
GameState → localStorage            ← auto-save after every action
       ↓
React re-render                     ← TopBar pills, VillagerSwarm, dialogue UI
```

### Node Types

| Type | Description |
|------|-------------|
| `dialogue` | NPC speaks; `speaker`, `text`, `next`, optional `avatar` + `bg` |
| `choice` | A/B/C selection; each option has an `effects[]` array |
| `idle` | Sandbox hub — player spends AP, then triggers the daily tick |
| `narration` | Full-screen centered text; optional `autoPlayDuration` for auto-advance |
| `achievement` | Full-screen trophy card; `text` is the achievement title |
| `title_secret` | Cinematic ending title — `speaker` = big headline, `text` = subtitle |

### Macroeconomic Model

```
GDP  = (population × 20) + (marketLevel × 300) + (productivity × 2)
     + (techLevel × 500) + (academyLevel × 800) + (mineLevel × 1200)
     + (money × 0.1)

CPI  = 100 × (money / 5000) / (productivity / 100)

UNEMP = max(0, laborForce − jobsAvailable) / laborForce × 100
        where laborForce  = floor(population × 0.6)
              jobsAvailable = floor(productivity/10) + mine×8 + farm×3 + market×4

Daily income = (pop×5) + (market×150) + (productivity×3) + (mine×300×tech)
             × happiness modifier (×0.2 if hap ≤ 30, ×0.6 if hap < 50, ×1.3 if hap > 80)
```

---

## Getting Started

### Prerequisites
- Node.js 18 +
- npm

### Install & Run

```bash
git clone https://github.com/Yinghao-Guan/Hackonomics.git
cd Hackonomics/village-economy
npm install
npm run dev          # → http://localhost:3000
```

### Other Commands

```bash
npm run build        # Production build (Turbopack)
npm run start        # Serve production build
npm run lint         # ESLint check
```

### Reset Save

Append `?reset=1` to the game URL to wipe localStorage and start fresh:
```
http://localhost:3000/game?reset=1
```

Or click **Clear Memory (Reset Save)** on the title screen.

---

## Game Systems

### Action Points (AP)
Every day resets to **3 AP**. Daily actions cost 1 AP; construction costs 3 AP. This enforces opportunity cost at the mechanical level — you cannot do everything at once.

### Crisis Alerts
When a crisis fires (from the daily tick), the screen flashes red with a crisis alert overlay showing the event name, description, and the immediate stat shocks applied before the story event begins.

### Danger States
TopBar stat pills turn red and pulse when:
- `foodStock < population` (starvation imminent)
- `cpi > 120` (inflation crisis)
- `unemploymentRate > 20%` (unemployment crisis)
- `happiness < 40` (riot risk)

### Population Dynamics
- Starvation: `deaths = ⌈|foodDeficit| / 1.5⌉` per day
- Immigration: if `GDP > 3000 && happiness ≥ 70 && foodStock > population × 3`, migrants arrive
- Riots: if `happiness ≤ 20`, a riot event fires (destroys market, costs money and population)
- Exile (bad ending): if `happiness = 0`, villagers overthrow you
- Death (bad ending): if `population = 0`, the village is abandoned

---

## Achievement System

30 unique achievements — one per major choice, plus special unlocks for endings. Each carries a short philosophical commentary connecting your in-game decision to its real-world economic school of thought.

| Achievement | English | Concept |
|---|---|---|
| 同甘共苦 | Shared Hardship | Equality over efficiency |
| 最优解？ | Optimal Solution? | Utilitarian calculus |
| 自由 or 逃避 | Freedom or Evasion | Hayekian spontaneous order |
| 未雨绸缪 | Prepared for the Worst | Keynesian risk management |
| 看不见的手 | The Invisible Hand | Austrian market self-order |
| 铁腕治河 | Iron Fist for the River | Command-and-control regulation |
| 庇古的算盘 | Pigou's Abacus | Pigouvian taxation |
| 科斯的手 | Coase's Hand | Coase Theorem / property rights |
| 卢德分子 | Luddite | Anti-technology protectionism |
| 福利国家 | Welfare State | Keynesian safety net |
| 创造性破坏 | Creative Destruction | Schumpeterian growth |
| 印钞机轰鸣 | The Money Printer Roars | Quantitative easing / MMT |
| 硬通货的尊严 | Dignity of Hard Currency | Gold standard / Austrian money |
| 征用令 | Expropriation Order | Forced asset seizure |
| 限价令 | Price Ceiling | Deadweight loss |
| 反垄断战争 | Antitrust War | Market competition restoration |
| 涓滴效应 | Trickle-down Effect | Supply-side economics |
| 直升机撒钱 | Helicopter Money | Keynesian stimulus |
| 清算主义者 | Liquidationist | Austrian business cycle theory |
| 国有化 | Nationalization | State ownership |
| 北欧之梦 | Nordic Dream | Progressive redistribution |
| 税制中性 | Tax Neutrality | Flat tax / supply-side |
| 搭便车者 | Free Rider | Public goods failure |
| 锁国令 | Isolation Decree | Protectionism / mercantilism |
| 关税壁垒 | Tariff Barrier | Trade compromise |
| 比较优势 | Comparative Advantage | Ricardian trade theory |
| 以牙还牙 | Tit for Tat | Competitive devaluation |
| 货币的尊严 | Monetary Dignity | Strong currency policy |
| 货币同盟 | Monetary Union | Currency union / Eurozone model |
| 时代的守望者 | The Watcher of Era | True ending — economic pluralism |

---

## Language Support

The game is fully bilingual. Click the **EN / 中文** button in the top-right corner of any screen to switch languages instantly. No page reload required.

| Translated | Details |
|---|---|
| All dialogue & narration | Every node in the 10-event story |
| All choice titles | A/B/C option text per event |
| Character names / speakers | Li (Prophet), all villager roles |
| Achievement titles & descriptions | Looked up by ID at render time |
| Crisis alert title & description | Per-event English translations |
| Daily summary panel | All labels and dynamic messages |
| Daily tick messages | Famine, riot, inflation, immigration, etc. |
| Idle panel UI | Action names, descriptions, button labels |
| TopBar & log drawer | Stat labels, button text |
| Title screen | Intro cutscene, menu buttons |
| All endings | True ending, both bad endings, secret ending |

Translation data lives in `src/lib/translations.ts`. The language state is stored in a React context (`src/lib/language.tsx`) and is accessible from any component via `useLanguage()`.

---

## Design Philosophy

### No Right Answer
Every A/B/C choice is constructed so that a thoughtful person in a specific economic tradition would choose it. The Austrian economist picks free markets in every crisis; the Keynesian picks government intervention. Neither is wrong within their own framework. The game never moralizes.

### Cascading Consequences
Decisions don't just change one number. Building a mine eventually triggers a monopoly crisis (Event 6). Printing money (Event 5) unlocks the Print Money daily action, which lets you keep inflating CPI. The systems interact continuously, not event by event.

### Behavioral Economics in the Mechanics
The Action Point system forces opportunity cost decisions mechanically. The "AP remaining unused" warning exploits loss aversion — players feel compelled to spend all three points even when doing so is suboptimal. Li the donkey calls this out explicitly after it happens.

### Narrative as Pedagogy
Every event is structured the same way: a human conflict introduces the concept emotionally, Li explains the economic theory with dark humor, then the choice is made. After the choice, Li names the concept explicitly and explains why every option had a price. Economics education through drama, not lecture.

### The Donkey
Li (立, Prophet) is the game's narrator, economist-in-residence, and moral foil. He never tells you what to do. He names what you already did. He is also, empirically, a donkey.

---

## Contributing

The project was built for the Hackonomics hackathon. The codebase is intentionally lean — no external game engine, no animation library, no state management beyond React hooks and `localStorage`. If extending the game:

- **New events**: Add nodes to `NODES` in `nodes.ts`, add English translations to `NODES_EN` in `translations.ts`, and set the trigger condition in `processDailyTick()` in `engine.ts`.
- **New achievements**: Add the effect `{ type: "achievement", id, title, description }` in a choice node, and add the English version to `ACHIEVEMENT_EN` in `translations.ts`.
- **New languages**: Add a key to the `Lang` type in `translations.ts`, extend the `UI`, `NODES_EN`, and `ENGINE_MSG` objects, and add the toggle case in `TopBar.tsx`.

---

## License

MIT
