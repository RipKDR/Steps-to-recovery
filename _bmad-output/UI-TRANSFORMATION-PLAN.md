# UI/UX Transformation Plan - BMAD Phased Approach

**Goal**: Transform Steps to Recovery app to match the reference app (12-Step-Companion) UI/UX

**Methodology**: BMAD (Build-Measure-Analyze-Decide)
- Build MVP features incrementally
- Measure user feedback after each phase
- Analyze what works/doesn't work
- Decide priorities for next phase

---

## Phase 1: Foundation (MVP) - Dark Theme + Core Visual Identity

**BUILD**: Essential visual transformation to establish new look & feel

### Changes:
1. **Dark Theme System**
   - Background: `#0B1120` (dark navy-black)
   - Surface cards: `#1A2332` (lighter navy)
   - Primary accent: `#5B9EFF` (bright blue)
   - Success/streak: `#00D4AA` (green)
   - Update all color tokens in `design-system/tokens/colors.ts`

2. **Circular Clean Time Tracker**
   - Replace linear time blocks with circular progress ring
   - Large centered number (days clean)
   - Green circular progress indicator
   - Smaller time units below (hours, minutes, seconds)

3. **Home Screen Layout Refresh**
   - Welcome header with sparkle icon
   - Motivational subtitle
   - Card-based layout with consistent spacing

### Files to Modify:
- `apps/mobile/src/design-system/tokens/colors.ts` - Add dark theme colors
- `apps/mobile/src/features/home/components/CleanTimeTracker.tsx` - Rebuild as circular
- `apps/mobile/src/features/home/screens/HomeScreen.tsx` - Update layout
- `apps/mobile/App.tsx` - Set dark theme as default

### Success Criteria:
- ✅ App displays with dark theme
- ✅ Clean time shows in circular format
- ✅ Home screen matches reference visual hierarchy
- ✅ All existing features still work

### MEASURE:
- Does the dark theme feel more immersive?
- Is the circular tracker easier to read?
- Any usability issues?

---

## Phase 2: Enhanced Check-Ins - Pulse Check + Tiny Inventory

**BUILD**: Upgrade daily check-in system to match reference app's depth

### Changes:
1. **Enhanced Pulse Check**
   - Replace simple text inputs with sliders
   - "How's your mood?" slider (Bad → Great)
   - "Craving intensity?" slider (None → Intense)
   - Mood tag buttons (Alone, With people, Bored, Stressed, Happy)
   - Optional content text area

2. **Tiny Inventory Section**
   - "Did I stay clean today?" (Yes/No/Close call radio buttons)
   - "Did I stay connected?" (Meetings, Sponsor, Recovery Friends checkboxes)
   - "One thing I'm grateful for (optional)" text area
   - "One thing I'd like to do differently tomorrow (optional)" text area
   - "Continue Tomorrow" button

3. **Recovery Rhythm Section**
   - Preset intention buttons:
     - "Set the Tone"
     - "Stay Clean"
     - "Stay Connected"
     - "Be Gentle with Myself"
     - "Custom" (opens text input)
   - "Set Intention" blue button

### Files to Create/Modify:
- `apps/mobile/src/features/home/components/PulseCheckCard.tsx` - NEW
- `apps/mobile/src/features/home/components/TinyInventoryCard.tsx` - NEW
- `apps/mobile/src/features/home/components/RecoveryRhythmCard.tsx` - NEW
- `apps/mobile/src/design-system/components/Slider.tsx` - NEW component
- `apps/mobile/src/design-system/components/TagButton.tsx` - NEW component
- Update database schema for new check-in fields

### Success Criteria:
- ✅ Users can set intentions from presets
- ✅ Pulse check uses sliders instead of text
- ✅ Tiny inventory captures daily reflection
- ✅ Data encrypts and syncs properly

### MEASURE:
- Do users engage more with sliders vs text?
- Are preset intentions used or do people customize?
- Does Tiny Inventory increase daily engagement?

---

## Phase 3: Streak Tracking + Gamification

**BUILD**: Add streak tracking, relapse counter, milestone progress

### Changes:
1. **Streak System**
   - "STREAK INTACT" green badge when active
   - Relapse counter (shows historical relapses)
   - Day streak counter separate from total clean time
   - Motivational messages ("Another week stronger. Keep going!")

2. **Enhanced Milestone Progress**
   - Current milestone bar with days remaining
   - Visual feedback when approaching milestone
   - Celebration when milestone reached

3. **Stats Cards**
   - "2 RELAPSES" stat
   - "0 SPONSOR EST" stat
   - "14 DAY STREAK" stat

### Files to Modify:
- `apps/mobile/src/features/home/components/CleanTimeTracker.tsx` - Add streak badge
- `apps/mobile/src/features/home/components/StatsRow.tsx` - NEW
- Database: Add `streaks` table, `relapses` table
- `apps/mobile/src/hooks/useStreakTracking.ts` - NEW

### Success Criteria:
- ✅ Streak tracking works correctly
- ✅ Relapses logged without shame/judgment
- ✅ Stats motivate continued progress

### MEASURE:
- Does streak tracking increase motivation?
- Do users find relapse counter helpful or discouraging?
- Which stats matter most to users?

---

## Phase 4: Navigation + Insights Tab

**BUILD**: Expand navigation, add analytics/insights

### Changes:
1. **Update Bottom Navigation (6 tabs)**
   - Home (house icon)
   - Steps (book icon)
   - Journal (notebook icon)
   - **Insights** (chart icon) - NEW
   - Emergency (alert icon)
   - **More** (dots icon) - NEW

2. **Insights Screen** (NEW)
   - Clean time trends
   - Check-in consistency graph
   - Mood/craving patterns over time
   - Step work progress chart
   - Meeting attendance tracking

3. **More Screen** (NEW)
   - Settings
   - Sponsor management
   - Notification preferences
   - About/Help
   - Privacy settings

### Files to Create/Modify:
- `apps/mobile/src/navigation/MainNavigator.tsx` - Add 2 new tabs
- `apps/mobile/src/features/insights/screens/InsightsScreen.tsx` - NEW
- `apps/mobile/src/features/insights/components/TrendChart.tsx` - NEW
- `apps/mobile/src/features/more/screens/MoreScreen.tsx` - NEW

### Success Criteria:
- ✅ 6-tab navigation works smoothly
- ✅ Insights show meaningful patterns
- ✅ More screen consolidates settings

### MEASURE:
- Do users find insights valuable?
- Which charts/graphs are most viewed?
- Does navigation feel cluttered or organized?

---

## Phase 5: Enhanced Step Work + AI Copilot

**BUILD**: Comprehensive step work system with 67 questions per step

### Changes:
1. **Key Themes Tags**
   - Each step shows theme tags (e.g., "powerlessness", "honesty", "surrender", "acceptance")
   - Visual categorization of content

2. **Expanded Question System**
   - Step 1: 67 detailed questions (vs current ~10)
   - Progress tracking: "Question 1 of 67 • 0 answered • 0% complete"
   - Auto-save as you type
   - Previous/Next navigation

3. **AI Copilot Integration** (Optional - requires API)
   - "Ask Copilot" button
   - AI helps answer difficult questions
   - Powered by OpenAI or similar

4. **Step Progress Tracking**
   - "Currently Working On" card
   - "In Progress" badge
   - "Continue Working" CTA button
   - Locked steps (unlock sequentially)

### Files to Modify:
- `apps/mobile/src/features/steps/screens/StepDetailScreen.tsx` - Major rebuild
- `apps/mobile/src/features/steps/components/KeyThemesTags.tsx` - NEW
- `apps/mobile/src/features/steps/components/QuestionCard.tsx` - NEW
- `apps/mobile/src/features/steps/data/step1Questions.ts` - Expand to 67 questions
- `apps/mobile/src/lib/aiCopilot.ts` - NEW (optional)

### Success Criteria:
- ✅ All 12 steps have comprehensive questions
- ✅ Progress saves automatically
- ✅ Users can navigate between questions easily
- ✅ AI Copilot provides helpful guidance (if implemented)

### MEASURE:
- Do 67 questions feel overwhelming or helpful?
- How many questions do users complete per session?
- Is AI Copilot used and helpful?
- Do users complete steps sequentially or jump around?

---

## Implementation Timeline (Estimated)

| Phase | Scope | Effort | Dependencies |
|-------|-------|--------|--------------|
| **Phase 1** | Dark theme + circular tracker | 2-3 days | None |
| **Phase 2** | Enhanced check-ins | 3-4 days | Phase 1 complete |
| **Phase 3** | Streak tracking | 2-3 days | Phase 2 complete |
| **Phase 4** | Navigation + Insights | 4-5 days | Phase 3 complete |
| **Phase 5** | Enhanced step work | 5-7 days | Phase 4 complete |

**Total**: ~16-22 days (3-4 weeks)

---

## BMAD Feedback Loops

After each phase:

### 1. BUILD ✅
- Implement features per phase plan
- Write tests
- Ensure existing functionality intact

### 2. MEASURE 📊
- User testing (if available)
- Monitor usage patterns
- Collect feedback

### 3. ANALYZE 🔍
- What worked well?
- What needs adjustment?
- Any unexpected issues?

### 4. DECIDE 🎯
- Adjust next phase priorities
- Refine features based on feedback
- Determine if features should be removed/simplified

---

## Success Metrics

### Phase 1:
- User feedback on dark theme (positive?)
- Clean time tracker usability (clearer?)

### Phase 2:
- Check-in completion rate increase (target: +20%)
- Slider interaction vs text input (preference?)

### Phase 3:
- Streak tracking engagement (daily opens increase?)
- Relapse logging (is it used?)

### Phase 4:
- Insights screen views per week (target: 3+)
- Navigation confusion (reduced?)

### Phase 5:
- Step work completion rate (increase?)
- Questions answered per step (average?)

---

## Risk Mitigation

### Technical Risks:
- **Dark theme accessibility** → Test with screen readers, ensure contrast ratios
- **Database migrations** → Backup data, test migration path
- **Performance with 67 questions** → Implement pagination, lazy loading

### UX Risks:
- **Dark theme too drastic** → Provide light/dark toggle
- **Too many check-ins feel burdensome** → Make sections collapsible
- **67 questions overwhelming** → Allow saving partial progress, show clear progress bar

### Privacy Risks:
- **New data fields = new encryption surface** → Ensure all new fields encrypted
- **AI Copilot = data sent to external API** → Make optional, clear consent, no PII sent

---

## Next Steps

1. **Review this plan** - Confirm phased approach makes sense
2. **Start Phase 1** - Dark theme + circular tracker (MVP)
3. **Test Phase 1** - Get feedback before moving to Phase 2
4. **Iterate** - Adjust based on learnings

**Ready to begin Phase 1?** 🚀
