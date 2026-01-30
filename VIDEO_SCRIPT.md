# 🎣 HookedIn - Video Presentation Script

**Target Duration:** 8-10 minutes
**Format:** AI-generated presenter + screen recordings
**Tone:** Professional but conversational, developer-to-developer
**Event:** LinkedIn Internal Hackathon

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

Webhooks are powerful. [PAUSE] They enable real-time integrations that create amazing user experiences.

[PAUSE]

But getting from idea to working webhook? [PAUSE] That takes time. Infrastructure setup. Challenge validation. Signature implementation. Deployment.

[PAUSE]

As LinkedIn engineers, we have something external developers don't: [PAUSE] insider knowledge of how our APIs work.

[PAUSE]

We used that knowledge to build a tool that helps everyone move faster.

This is HookedIn. [PAUSE] Let's dive in.

---

### SCENE 2: THE DEVELOPER CHALLENGE (0:45 - 2:15)
**🎤 AI PRESENTER**

---

**SPEAKER:**

Let me walk you through the typical webhook integration journey. [PAUSE] It requires several steps.

[PAUSE]

**First**, you need infrastructure. A publicly accessible HTTPS endpoint [EMPHASIS] before [/EMPHASIS] you can test anything. That means deploying to production or setting up local tunneling.

[PAUSE]

**Second**, you implement challenge validation. LinkedIn sends a challenge request, and your endpoint must respond correctly on the first try.

[PAUSE]

**Third**, you implement signature validation using HMAC-SHA-256. [PAUSE] This ensures events are authentic.

[PAUSE]

The signature validation is cryptographic, [PAUSE] which means implementation details matter. Let me show you what's involved.

---

**📺 B-ROLL** - Show code snippet (text overlay):
```javascript
// Basic signature validation approach
const hmac = crypto.createHmac('sha256', clientSecret);
hmac.update(payload);
const signature = hmac.digest('hex');
```

**🎤 AI PRESENTER VOICEOVER:**

This looks straightforward. [PAUSE] But cryptographic operations require precise implementation. [PAUSE] Every byte matters.

[PAUSE]

Getting this right typically involves several hours of research, implementation, and debugging.

---

### SCENE 3: THE INSIGHT (2:15 - 3:30)
**🎤 AI PRESENTER - Full screen**

---

**SPEAKER:**

As LinkedIn engineers, we have access to something external developers don't: [PAUSE] the actual implementation.

[PAUSE]

So we looked at how signature validation really works.

---

**📺 SCREEN RECORDING / B-ROLL** - Show LINKEDIN_WEBHOOK_SIGNATURE_VALIDATION.md
- Open the file
- Scroll to the implementation details section
- Highlight the key line

**🎤 AI PRESENTER VOICEOVER:**

Here's what we found in the implementation. [PAUSE] The file is PartnerPushEventCredentialPlugin dot java.

Look at this line: [SLOW] "string to sign equals SIGN_PREFIX plus payload"

[PAUSE]

The implementation prepends [EMPHASIS] "hmacsha256 equals" [/EMPHASIS] to the payload [EMPHASIS] before [/EMPHASIS] computing the HMAC.

This is an important implementation detail.

---

**📺 B-ROLL** - Side-by-side comparison (text overlay):
```
SIMPLIFIED:                 COMPLETE:
hmac(payload)              hmac("hmacsha256=" + payload)
        ⚠️                          ✅
```

**🎤 AI PRESENTER VOICEOVER:**

Understanding the complete implementation is key to getting signature validation right.

[PAUSE]

This kind of insight is exactly what external developers need.

---

**🎤 AI PRESENTER - Full screen**

---

**SPEAKER:**

That's why we built HookedIn. [PAUSE] To share our insider knowledge and help developers succeed faster.

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

Traditional webhook integration takes [EMPHASIS] six to ten hours. [/EMPHASIS] [PAUSE] Infrastructure setup, implementation, testing, debugging, deployment.

[PAUSE]

With HookedIn? [PAUSE] Two minutes to start testing.

[PAUSE]

This is a [EMPHASIS] ninety-five percent reduction [/EMPHASIS] in time-to-first-event.

---

**📺 B-ROLL** - Show text/graphics:
```
Traditional Approach:
⏱️ 6-10+ hours total
🏗️ Infrastructure setup first
🔍 Manual debugging process
📊 No event visibility

HookedIn Approach:
✅ 2 minutes to start testing
✅ Zero infrastructure needed
✅ Complete validation examples
✅ Real-time monitoring + analytics
```

**🎤 AI PRESENTER VOICEOVER:**

Think about our developer ecosystem. [PAUSE] Thousands of developers building on LinkedIn's platform.

[PAUSE]

Every hour saved in webhook setup is an hour spent building amazing integrations.

---

### SCENE 11: THE CONTRIBUTION (9:00 - 9:30)
**🎤 AI PRESENTER - Full screen**

---

**SPEAKER:**

But we didn't just build a tool. [PAUSE] We created comprehensive documentation for the entire developer community.

[PAUSE]

Our signature validation guide covers [EMPHASIS] six programming languages. [/EMPHASIS] [PAUSE] Node.js, Python, Java, Ruby, Go, and PHP.

[PAUSE]

Complete working implementations that developers can reference and adapt. [PAUSE] This is how we strengthen LinkedIn's developer ecosystem.

---

### SCENE 12: CLOSING (9:30 - 10:00)
**🎤 AI PRESENTER - Full screen**

---

**SPEAKER:**

HookedIn started with a simple question: [PAUSE] How can we make LinkedIn webhook integration easier?

[PAUSE]

As LinkedIn engineers, we have insider knowledge of how our APIs work. [PAUSE] We used that advantage to build something that helps everyone.

[PAUSE]

HookedIn provides instant testing, complete code examples, and production-ready generation. [PAUSE] Days of work become minutes.

[PAUSE]

This demonstrates how we can leverage our position to accelerate our developer community. [PAUSE] And ultimately, strengthen LinkedIn's platform.

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
