# Star Quest 🌟

A neon arcade-style math fact fluency web app for mastering **multiplication, addition, and subtraction** in just **5 fun minutes a day**! Originally built with love for Lyra, it now becomes each player's own quest: enter your name on the welcome screen and it's *"Your Name's Star Quest"* everywhere, from the cheers to the badges.

Designed for young math explorers (around 8 years old) to enjoy seamlessly on both **iPad** (tactile on-screen keypad, full-screen home screen app, offline support) and **Desktop/Laptop** (physical keyboard support).

---

## ✨ Features

- 👋 **Your Personal Quest**: The first visit asks "What's your name, player?" The name appears in the title, cheers, buddy lines, Trophy Room, and badges, and can be changed anytime in ⚙️ Settings.
- ⏱️ **5-Minute Daily Quest**: A friendly countdown timer with a circular starlight progress ring that adapts across addition, subtraction, and multiplication facts.
- 🎲 **Quick Mode Picker**: One tap for Mixed, Just Adding, Just Subtracting, or Just Multiplying, plus 🐣 Easy, 🎮 Normal, or 👾 Boss Mode levels.
- 🎯 **Drill Mode** (multi-select, remembered between visits):
  - **✖️ Times tables**: pick any tables from 0 to 12 (e.g. 6s, 7s & 8s), each from × 0 all the way to × 12.
  - **➕ Addition strategies**: +1 / +2, Doubles, Near Doubles, Ten Pairs, Over 10, and +10.
  - **➖ Subtraction strategies**: −1 / −2, From 10, Halves, −9 / −10, and Across 10.
- 💡 **Visual Hint System ("Show Me!")**:
  - **Multiplication**: Buddy-filled array grids ($a \text{ rows} \times b \text{ columns}$) with number-sense chunking tips (e.g. *"Friendly Chunk: $5 \times 7 = 35$. Now add 1 more 7!"*).
  - **Addition**: Visual ten-frames demonstrating the *"make a 10"* strategy.
  - **Subtraction**: Visual removal dots and think-addition hints ($b + \text{?} = a$).
  - **Hints teach, they don't tell**: Show Me unlocks (🔒 → 💡) only after one real try, and every hint stops one step short of the answer so the player finishes it.
  - A fact answered after peeking stays at Lv.1 for more practice instead of counting toward Mastered.
- 🌌 **Constellation Map**: Every day the player completes their quest, a new glowing star lights up in the sky map, with ranks from *Celestial Apprentice* up to *Legend of the Cosmic Caticorn*.
- 🏅 **Quest Badges**: Every finished daily quest draws a one-of-a-kind badge (Legendary, Epic, or Rare) with a full report: facts solved, first-try %, best combo, streak, how each operation went, facts to level up, randomized praise, a pro tip for the trickiest fact, and ideas for next time.
- 💾 **Save & Trophy Room**: Badges save as a picture (iPad share sheet → Save Image, or a download on a computer), and every badge is kept in the 🏅 Trophy Room to revisit and save again.
- 🐯 **The Squad**: Pick a buddy: Derpy the goofy tiger, Brainy the friendly zombie, Luna the vampire girl, Pixel the arcade alien, Celeste the unicorn, Barnaby the space cat, Sparkle the caticorn, or Nova the star. Buddies cheer the player on, fill the Show Me! arrays, and celebrate mistakes as brain stretches.
- 🔊 **Tactile Web Audio Synthesizer**: Bubbly clicks on button tap, ascending pentatonic chimes on correct answers, and a grand cosmic celebration fanfare on daily completion (100% offline, zero audio file dependencies, with instant mute button).
- 🎨 **5 Themes**: 🎮 *Arcade* (the default: neon grid, glowing cards, chunky arcade buttons, pixel-font titles), plus *Unicorn*, *Cat*, *Nebula*, and *Candy*.
- ⚙️ **Parent / Teacher Settings Drawer**: Easily customize which operations are active, select specific times tables ($0-12$), adjust addition/subtraction max sums, or adjust session length ($3$, $5$, or $10$ minutes).

---

## 🤫 Secret Easter Eggs & Fun Codes

1. **Supernova Party Mode (Disco Nova)**:
   - Tap **your buddy mascot** (top left) **5 times quickly**!
   - Rainbow disco strobes ignite and party confetti rains down with chiptune synth beats! (Nova, Celeste, Barnaby, and Sparkle also put on disco sunglasses.)
2. **Secret Keyboard Codes** (Desktop / Keyboard):
   - Type `party` anywhere to start Supernova Party Mode!
   - Type `galaxy` for a Galactic Star Shower!
   - Type `nova` to get Nova's lucky wink!
   - Enter the classic **Konami Code** (`↑` `↑` `↓` `↓` `←` `→` `←` `→` `b` `a`) for an epic party blast!

---

## 🚀 How to Publish to GitHub Pages

Because this project is built as a clean, zero-build modern web app, deploying it takes less than 60 seconds:

### Step 1: Create a GitHub Repository
1. Go to [github.com/new](https://github.com/new).
2. Name the repository (e.g., `lyras-star-quest` or `math-quest`).
3. Leave it Public (or Private with GitHub Pro) and **do not** check "Add a README" (we already have everything set up).

### Step 2: Push your local code
In your terminal, inside this directory (`/Users/davidknuffke/Documents/Programming/Lyra Stuff`):

```bash
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to your repository on GitHub.
2. Click **Settings** ➔ **Pages** (in the left sidebar).
3. Under **Build and deployment**:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` / folder: `/ (root)`
4. Click **Save**.
5. Within 1–2 minutes, GitHub will give you a live URL:
   `https://YOUR_GITHUB_USERNAME.github.io/YOUR_REPO_NAME/`

---

## 📱 How to Install on an iPad (Full Screen & Offline)

1. Open **Safari** on the iPad and navigate to the GitHub Pages URL.
2. Tap the **Share** button (the square with an arrow pointing up at the top or bottom of Safari).
3. Scroll down and tap **"Add to Home Screen"** (`+`).
4. Name it **"Star Quest"** and tap **Add**.
5. A beautiful custom star icon will appear on the iPad home screen. When tapped, it opens full-screen without Safari browser bars or tabs, looking and feeling like a native App Store game—and it will work even offline!
