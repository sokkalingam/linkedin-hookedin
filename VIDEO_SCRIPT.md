# 🎣 HookedIn - Video Presentation Script

**Target Duration:** 8-10 minutes
**Format:** AI-generated presenter + screen recordings
**Tone:** Professional but conversational, developer-to-developer

---

## 📋 Production Notes

### Video Sections Structure
- **🎤 AI PRESENTER** - Talking head segments (use AI video generation)
- **🖥️ SCREEN RECORDING** - Live demo footage (you record these)
- **📺 B-ROLL** - Code snippets, documentation screenshots, visual emphasis

### Timing Markers
- `[PAUSE]` - 1-2 second pause for emphasis
- `[SCREEN: description]` - Cut to screen recording
- `[EMPHASIS]` - Stress this word/phrase with energy
- `[SLOW]` - Slow down for clarity

### AI Voice Direction
- Use a professional, friendly voice
- Medium pace (not too fast)
- Slight enthusiasm (not monotone, but not overly excited)
- Developer-focused authenticity

---

## 🎬 FULL SCRIPT

---

### SCENE 1: THE HOOK (0:00 - 0:45)
**🎤 AI PRESENTER - Full screen**

---

**SPEAKER:**

Have you ever spent hours debugging an API integration [PAUSE] only to discover the documentation was wrong?

[PAUSE]

That's exactly what happened with LinkedIn webhooks. [PAUSE] And it's been costing developers [EMPHASIS] days [/EMPHASIS] of frustration.

[PAUSE]

I'm going to show you something that most developers never get to see. [PAUSE] The actual source code behind LinkedIn's webhook implementation. [PAUSE] And how we built a tool that fixes a problem that's been hidden for years.

This is HookedIn. [PAUSE] Let's dive in.

---

### SCENE 2: THE PROBLEM - PART 1 (0:45 - 2:15)
**🎤 AI PRESENTER**

---

**SPEAKER:**

Let me show you the problem. [PAUSE] When you want to integrate LinkedIn webhooks into your application, you need to do three things.

[PAUSE]

**First**, you need a publicly accessible HTTPS endpoint [EMPHASIS] before [/EMPHASIS] you can even test. That means you can't test locally. You need to deploy to production or set up tunneling tools like ngrok.

[PAUSE]

**Second**, LinkedIn sends a "challenge" request to validate your endpoint. If you don't respond correctly, [EMPHASIS] your webhook is disabled. [/EMPHASIS] No second chances.

[PAUSE]

**Third**, and this is where it gets interesting [PAUSE] you need to validate webhook signatures using HMAC-SHA-256.

[PAUSE]

Sounds straightforward, right? [PAUSE] Let me show you LinkedIn's official documentation.

---

**📺 SCREEN RECORDING** - Show LinkedIn's official documentation
- Navigate to: https://learn.microsoft.com/en-us/linkedin/shared/api-guide/webhook-validation
- Scroll to signature validation section
- Highlight the relevant text

**🎤 AI PRESENTER VOICEOVER:**

LinkedIn's documentation says [SLOW] "The value of this header is the HMAC-SHA-256 hash of the JSON-encoded string representation of the POST body."

Simple enough. Here's what that looks like in code.

---

**📺 B-ROLL** - Show code snippet (text overlay):
```javascript
// LinkedIn's documentation
const hmac = crypto.createHmac('sha256', clientSecret);
hmac.update(payload);
const signature = hmac.digest('hex');
```

**🎤 AI PRESENTER VOICEOVER:**

You implement exactly what the docs say. [PAUSE] But here's the problem.

[PAUSE - 2 seconds]

**It fails. Every single time.**

---

### SCENE 3: THE DISCOVERY (2:15 - 3:30)
**🎤 AI PRESENTER - Full screen**

---

**SPEAKER:**

After hours of debugging, we did something most developers can't do. [PAUSE] We accessed LinkedIn's actual source code.

[PAUSE]

And what we found was shocking.

---

**📺 SCREEN RECORDING / B-ROLL** - Show LINKEDIN_WEBHOOK_SIGNATURE_VALIDATION.md
- Open the file
- Scroll to the Java source code section
- Highlight the key line

**🎤 AI PRESENTER VOICEOVER:**

This is from LinkedIn's actual Java implementation. [PAUSE] The file is called PartnerPushEventCredentialPlugin dot java.

Look at this line: [SLOW] "string to sign equals SIGN_PREFIX plus payload"

[PAUSE]

LinkedIn prepends [EMPHASIS] "hmacsha256 equals" [/EMPHASIS] to the payload [EMPHASIS] before [/EMPHASIS] computing the HMAC.

This is [EMPHASIS] completely undocumented. [/EMPHASIS]

---

**📺 B-ROLL** - Side-by-side comparison (text overlay):
```
DOCUMENTED:                 ACTUAL:
hmac(payload)              hmac("hmacsha256=" + payload)
        ❌                          ✅
```

**🎤 AI PRESENTER VOICEOVER:**

The documentation says one thing. [PAUSE] The code does another. [PAUSE] Without access to the source code, you're stuck.

---

**🎤 AI PRESENTER - Full screen**

---

**SPEAKER:**

That's why we built HookedIn. [PAUSE] We reverse-engineered LinkedIn's bugs so developers don't have to.

---

### SCENE 4: THE SOLUTION - OVERVIEW (3:30 - 4:00)
**🎤 AI PRESENTER**

---

**SPEAKER:**

HookedIn solves three major problems.

[PAUSE]

**One:** Instant webhook testing with no deployment required.

**Two:** Correct signature validation that actually works.

**Three:** Production-ready code generation with the fix built in.

[PAUSE]

Let me show you how it works.

---

### SCENE 5: LIVE DEMO - CREATE WEBHOOK (4:00 - 5:00)
**🖥️ SCREEN RECORDING** - Full demo of HookedIn

**Recording Steps:**
1. Navigate to https://linkedin-hookedin.vercel.app
2. Click "Create Webhook"
3. Enter Client ID and Client Secret
4. Click "Create Webhook"
5. Show the generated webhook URL
6. Click the copy button

**🎤 AI PRESENTER VOICEOVER:**

Here's HookedIn in action. [PAUSE] I'm going to create a new webhook.

[PAUSE]

I enter my LinkedIn app's client ID and secret. [PAUSE] Click create.

[PAUSE - watch action happen]

And just like that, in [EMPHASIS] ten seconds, [/EMPHASIS] I have a production-ready webhook endpoint. [PAUSE] No deployment. No ngrok. No setup.

[PAUSE]

The URL is public and HTTPS, exactly what LinkedIn needs. Let me copy this.

---

### SCENE 6: LIVE DEMO - LINKEDIN CONFIGURATION (5:00 - 5:30)
**🖥️ SCREEN RECORDING** - LinkedIn Developer Portal

**Recording Steps:**
1. Open LinkedIn Developer Portal
2. Navigate to your app
3. Go to Webhooks section
4. Paste the HookedIn URL
5. Click Verify
6. Show success message

**🎤 AI PRESENTER VOICEOVER:**

Now I'll configure this in LinkedIn's Developer Portal. [PAUSE] Paste the webhook URL. [PAUSE] Click verify.

[PAUSE - watch validation happen]

LinkedIn sends a challenge request. [PAUSE] HookedIn automatically responds with the correct validation.

[PAUSE]

No code needed. It just works.

---

### SCENE 7: LIVE DEMO - VIEW EVENTS (5:30 - 6:30)
**🖥️ SCREEN RECORDING** - HookedIn event list

**Recording Steps:**
1. Go back to HookedIn
2. Navigate to "Manage Webhooks"
3. Enter Client ID and retrieve webhooks
4. Click "View Events" on the webhook
5. Show events with syntax highlighting
6. Expand an event to show headers and payload
7. Point out the green "✓ Valid" validation status
8. Demonstrate search functionality - type "MEMBER_DATA"
9. Show filtered results

**🎤 AI PRESENTER VOICEOVER:**

Back in HookedIn, let's view the events. [PAUSE] I'll retrieve my webhooks using the client ID.

[PAUSE]

Here's the webhook we just created. Let me view the events.

[PAUSE]

You can see the challenge request that LinkedIn sent. [PAUSE] And here's a real webhook event.

[PAUSE]

Notice the beautiful JSON formatting with syntax highlighting. [PAUSE] And look at this green checkmark, [PAUSE] [EMPHASIS] signature validated successfully. [/EMPHASIS]

[PAUSE]

If you have hundreds or thousands of events, you can search through them instantly. [PAUSE] Let me search for "MEMBER_DATA".

[PAUSE - watch search]

And there we go. [PAUSE] Find exactly what you need in seconds.

---

### SCENE 8: LIVE DEMO - ANALYTICS (6:30 - 7:15)
**🖥️ SCREEN RECORDING** - Analytics dashboard

**Recording Steps:**
1. Click "📊 Analytics" button
2. Show the 4 stat cards at the top
3. Demonstrate time range selector (click 1 Day, 7 Days, 30 Days)
4. Show the line chart responding
5. Scroll to show pie chart and bar chart
6. Point out the health score

**🎤 AI PRESENTER VOICEOVER:**

HookedIn also gives you analytics that LinkedIn doesn't provide. [PAUSE] Click the Analytics button.

[PAUSE]

You get visual insights into webhook performance. [PAUSE] Total events, challenges, notifications, and any signature validation failures.

[PAUSE]

This line chart shows event volume over time. [PAUSE] You can filter by one day, seven days, or thirty days.

[PAUSE]

And here's the health score. [PAUSE] One hundred percent means all signatures are valid. [PAUSE] This helps you identify issues before they become problems.

---

### SCENE 9: LIVE DEMO - CODE GENERATOR (7:15 - 8:00)
**🖥️ SCREEN RECORDING** - Code generator

**Recording Steps:**
1. Navigate to Code Generator (from webhook detail or nav)
2. Show the generated Node.js code
3. Scroll through, highlighting:
   - The signature validation function
   - The comment explaining LinkedIn's bug
   - The SIGN_PREFIX line
4. Show the deployment instructions (collapsed section)

**🎤 AI PRESENTER VOICEOVER:**

Now here's where it gets really powerful. [PAUSE] HookedIn generates production-ready code for you.

[PAUSE]

This is a complete Node.js webhook server. [PAUSE] Look at this signature validation function.

[PAUSE - scroll to the critical section]

Here's the fix. [PAUSE] [SLOW] "Prepend hmacsha256 equals to the payload before hashing."

[PAUSE]

Notice the detailed comments explaining LinkedIn's bug. [PAUSE] What took us days to figure out is now copy-paste ready.

[PAUSE]

It even includes deployment instructions for Vercel, Railway, and Render.

---

### SCENE 10: THE IMPACT (8:00 - 9:00)
**🎤 AI PRESENTER - Full screen**

---

**SPEAKER:**

Let's talk about impact.

[PAUSE]

Before HookedIn, integrating LinkedIn webhooks took [EMPHASIS] six to ten hours [/EMPHASIS] of setup and debugging. [PAUSE] Sometimes more. [PAUSE] Sometimes developers just gave up.

[PAUSE]

With HookedIn? [PAUSE] Two minutes.

[PAUSE]

We're not talking about a marginal improvement. [PAUSE] This is a [EMPHASIS] ninety-five percent reduction [/EMPHASIS] in developer time.

---

**📺 B-ROLL** - Show text/graphics:
```
Before HookedIn:
❌ 6-10+ hours of setup
❌ Deploy to production to test
❌ Signature validation fails mysteriously
❌ No visibility into events

After HookedIn:
✅ 2 minutes to working webhook
✅ Test instantly without deployment
✅ Correct validation out of the box
✅ Real-time monitoring + analytics
```

**🎤 AI PRESENTER VOICEOVER:**

Think about this. [PAUSE] If one thousand developers each spend ten hours fighting LinkedIn webhooks, [PAUSE] that's ten thousand hours of wasted engineering time.

[PAUSE]

HookedIn gives those hours back.

---

### SCENE 11: THE CONTRIBUTION (9:00 - 9:30)
**🎤 AI PRESENTER - Full screen**

---

**SPEAKER:**

But we didn't just build a tool. [PAUSE] We documented the fix openly for the entire developer community.

[PAUSE]

Our signature validation documentation covers [EMPHASIS] six programming languages. [/EMPHASIS] [PAUSE] Node.js, Python, Java, Ruby, Go, and PHP.

[PAUSE]

Every developer who runs into this problem can now find the solution. [PAUSE] That's the kind of contribution that moves the industry forward.

---

### SCENE 12: CLOSING (9:30 - 10:00)
**🎤 AI PRESENTER - Full screen**

---

**SPEAKER:**

HookedIn started with a simple question: [PAUSE] Why is LinkedIn webhook integration so hard?

[PAUSE]

The answer led us to discover a critical bug in LinkedIn's implementation. [PAUSE] One that's been causing developer frustration for years.

[PAUSE]

But we didn't just find the bug. [PAUSE] We built a complete solution that turns days of work into minutes.

[PAUSE]

HookedIn is proof that when we dig deep into hard problems, [PAUSE] we can build solutions that help thousands of developers.

[PAUSE - confident close]

Thank you. [PAUSE] And let's get HookedIn.

---

**📺 B-ROLL** - End card with text:
```
🎣 HookedIn
linkedin-hookedin.vercel.app

Built with ❤️ for developers
```

---

## 🎬 PRODUCTION CHECKLIST

### Screen Recordings You Need
- [ ] **LinkedIn docs** - Showing the incorrect documentation
- [ ] **HookedIn homepage** - Clean, no clutter
- [ ] **Create webhook flow** - Smooth, no mistakes
- [ ] **LinkedIn Developer Portal** - Webhook configuration and verification
- [ ] **Event list** - With real events showing valid signatures
- [ ] **Search functionality** - Type and show results
- [ ] **Analytics dashboard** - All features, time range switching
- [ ] **Code generator** - Full scroll-through of generated code
- [ ] **Your documentation** - LINKEDIN_WEBHOOK_SIGNATURE_VALIDATION.md

### B-Roll / Graphics You Need
- [ ] Side-by-side code comparison (documented vs actual)
- [ ] Before/After comparison list
- [ ] Stats/numbers overlay (95% time reduction)
- [ ] End card with URL and branding

### Audio Considerations
- [ ] Background music (subtle, not distracting)
- [ ] Sound effects for transitions (optional, use sparingly)
- [ ] Consistent volume levels throughout
- [ ] Clear voice without background noise

---

## 🎥 Recommended AI Video Tools

### Option 1: **HeyGen** (Recommended)
- Most natural-looking avatars
- Great voice quality
- Easy to use
- ~$30-50 for a month
- **Use Case:** Best for professional, polished presenter

### Option 2: **Synthesia**
- Large avatar library
- Multiple languages
- Good for corporate look
- ~$30-90/month
- **Use Case:** Most versatile, lots of options

### Option 3: **D-ID**
- Fast generation
- Good lip-sync
- More affordable
- ~$6-30/month
- **Use Case:** Budget-friendly option

### Option 4: **Runway Gen-2 + ElevenLabs**
- Runway for avatar video
- ElevenLabs for voice
- Most customizable
- More complex workflow
- **Use Case:** If you want maximum control

---

## 📝 Production Tips

### Recording Screen Captures
1. **Use 1920x1080 resolution** (1080p)
2. **Record at 60 FPS** for smooth animations
3. **Hide desktop clutter** (clean desktop, close unnecessary apps)
4. **Disable notifications** (Do Not Disturb mode)
5. **Use cursor highlighting** (macOS: System Preferences > Accessibility)
6. **Record in segments** (easier to edit)
7. **Leave 2-3 seconds of padding** at start and end of each clip

### Editing in Post
1. **Use fade transitions** between AI presenter and screen recordings
2. **Add subtle zoom effects** to highlight key UI elements
3. **Include captions** for accessibility and clarity
4. **Keep cuts tight** - no dead air longer than 2 seconds
5. **Add progress indicators** (optional) showing sections
6. **Test audio levels** - voice should be louder than music

### Tools You Can Use
- **Video Editing:** DaVinci Resolve (free), Final Cut Pro, Adobe Premiere
- **Screen Recording:** OBS Studio (free), ScreenFlow, Camtasia
- **Graphics/B-Roll:** Canva (easy), Figma (flexible), After Effects (advanced)

---

## ⏱️ Timing Breakdown

| Section | Duration | Content Type |
|---------|----------|--------------|
| Hook | 0:45 | AI Presenter |
| Problem Part 1 | 1:30 | AI + Screen |
| Discovery | 1:15 | AI + Screen |
| Solution Overview | 0:30 | AI Presenter |
| Demo: Create | 1:00 | Screen Recording |
| Demo: Configure | 0:30 | Screen Recording |
| Demo: Events | 1:00 | Screen Recording |
| Demo: Analytics | 0:45 | Screen Recording |
| Demo: Code Gen | 0:45 | Screen Recording |
| Impact | 1:00 | AI + B-Roll |
| Contribution | 0:30 | AI Presenter |
| Closing | 0:30 | AI Presenter |
| **TOTAL** | **10:00** | |

---

## 🎯 Why This Script Works

✅ **Starts with a hook** - Relatable developer pain
✅ **Tells a story** - Problem → Discovery → Solution
✅ **Shows, doesn't tell** - Live demo with narration
✅ **Builds credibility** - You had access to source code
✅ **Demonstrates value** - 95% time savings
✅ **Ends with impact** - Community contribution

---

## 💬 Alternative: Should You Present Live?

### Pros of AI Video:
- ✅ No nervousness, consistent delivery
- ✅ Can re-record easily
- ✅ Professional production quality
- ✅ Flexible editing

### Pros of Live Presentation:
- ✅ More authentic and personal
- ✅ Can respond to reactions
- ✅ Shows confidence
- ✅ More engaging for live audience

### My Recommendation:
**Use AI video if:**
- This is a recorded submission
- You want maximum polish
- You're not comfortable on camera
- You have limited time

**Present live if:**
- You're presenting in-person
- You're comfortable on camera
- You want to demo in real-time
- The hackathon requires live presentations

**Hybrid approach (BEST):**
- Record a polished AI video as your "official submission"
- Prepare to present live if needed
- Use the video as backup if technical issues occur

---

**Good luck with your video production! 🎬🚀**
