# 🚀 Feature Enhancements MVP
## Steps to Recovery - BMAD Implementation Plan

> **Methodology**: Build-Measure-Analyze-Decide  
> **Created**: January 30, 2026  
> **Schema Version**: 8 → 9 (after implementation)  
> **Goal**: Maximize user retention through daily engagement hooks, gamification, and proactive support

---

## 📊 Executive Summary

This document outlines **22 optimized features** across 4 sprints, designed to increase:
- **D1 Retention**: Target 70% (users returning next day)
- **D7 Retention**: Target 50% (users returning after 1 week)
- **D30 Retention**: Target 30% (users returning after 1 month)
- **DAU/MAU Ratio**: Target 40%

### Key Optimizations from Original Brainstorm

| Original Idea | Optimization | Rationale |
|---------------|--------------|-----------|
| New streaks table | Extend existing `achievements` table | Reduces migration complexity, leverages existing patterns |
| Separate analytics feature | Integrate into `ProgressDashboardScreen` | Uses existing navigation, fewer new screens |
| Multiple breathing patterns | Enhance existing `BreathingCircle` component | Component already exists with 4-phase animation |
| New intention templates screen | Add to existing `MorningIntentionScreen` | Preserves premium animation flow |
| Separate insights feature | Local analysis in hooks | No new feature folder needed |

---

## 🗺️ Dependency Graph

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          FEATURE DEPENDENCY MAP                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  SPRINT 1: Daily Engagement (No Dependencies)                               │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │ 1.1 Intention   │  │ 1.2 Yesterday's │  │ 1.3 Streak      │             │
│  │    Templates    │  │    Wins Remind  │  │    Grace Period │             │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘             │
│           │                    │                    │                       │
│           └────────────────────┼────────────────────┘                       │
│                                ▼                                            │
│  SPRINT 2: Gamification ───────────────────────────────────────────────    │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │ 2.1 Multi-Streak│  │ 2.2 Progress    │  │ 2.3 Achievement │             │
│  │    Tracking     │──▶│    Rings        │  │    Animations   │             │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘             │
│           │                    │                    │                       │
│           └────────────────────┼────────────────────┘                       │
│                                ▼                                            │
│  SPRINT 3: Analytics & Insights ───────────────────────────────────────    │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │ 3.1 Mood Trend  │  │ 3.2 Craving     │  │ 3.3 Correlation │             │
│  │    Charts       │──▶│    Patterns     │──▶│    Insights     │             │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘             │
│           │                    │                    │                       │
│           └────────────────────┼────────────────────┘                       │
│                                ▼                                            │
│  SPRINT 4: Proactive Support ──────────────────────────────────────────    │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │ 4.1 Pattern     │  │ 4.2 Enhanced    │  │ 4.3 Safety Plan │             │
│  │    Nudges       │  │    Breathing    │  │    Builder      │             │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📋 Progress Tracker

| Sprint | Feature | Size | Status | Deps |
|--------|---------|------|--------|------|
| **1** | 1.1 Morning Intention Templates | S | ⬜ TODO | - |
| **1** | 1.2 Yesterday's Wins Reminder | S | ⬜ TODO | - |
| **1** | 1.3 Streak Grace Period | S | ⬜ TODO | - |
| **1** | 1.4 Evening Reflection Templates | S | ⬜ TODO | - |
| **1** | 1.5 "On This Day" Memories | S | ⬜ TODO | - |
| **2** | 2.1 Multi-Streak Tracking System | M | ⬜ TODO | 1.x |
| **2** | 2.2 Visual Progress Rings | M | ⬜ TODO | 2.1 |
| **2** | 2.3 Achievement Celebration Animations | S | ⬜ TODO | - |
| **2** | 2.4 Yearly Engagement Heatmap | M | ⬜ TODO | 2.1 |
| **2** | 2.5 Shareable Milestone Cards | M | ⬜ TODO | - |
| **3** | 3.1 Mood Trend Visualization | M | ⬜ TODO | 2.1 |
| **3** | 3.2 Craving Pattern Analysis | M | ⬜ TODO | 3.1 |
| **3** | 3.3 Correlation Insights Engine | L | ⬜ TODO | 3.2 |
| **3** | 3.4 Weekly Recovery Report | M | ⬜ TODO | 3.x |
| **3** | 3.5 PDF Export Enhancement | M | ⬜ TODO | 3.4 |
| **4** | 4.1 Pattern-Based Gentle Nudges | L | ⬜ TODO | 3.3 |
| **4** | 4.2 Enhanced Breathing Exercises | M | ⬜ TODO | - |
| **4** | 4.3 5-4-3-2-1 Grounding Enhancement | M | ⬜ TODO | - |
| **4** | 4.4 Safety Plan Builder | L | ⬜ TODO | - |
| **4** | 4.5 Trigger Inventory System | M | ⬜ TODO | 4.4 |
| **4** | 4.6 Quick Action Cards | S | ⬜ TODO | 4.5 |
| **4** | 4.7 HALT Check-in | S | ⬜ TODO | - |

---

# 🎯 SPRINT 1: Daily Engagement System
**Timeline**: Week 1-2  
**Goal**: Reduce friction, increase daily opens, build habit loops

---

## 1.1 Morning Intention Templates

### Priority & Sizing
- **Priority**: P0 (Critical for retention)
- **Size**: Small (1-2 days)
- **Dependencies**: None
- **Risk**: Low

### User Story
> As a user in early recovery, I want to quickly set my intention for the day with pre-defined options, so I can maintain my morning routine even when I'm exhausted or rushed.

### Acceptance Criteria
- [ ] Display 8 curated intention templates on morning check-in
- [ ] Templates rotate daily (seeded by date) to stay fresh
- [ ] User can still type custom intention (existing behavior)
- [ ] Selected template stored encrypted like custom text
- [ ] Templates themed to 12-step principles
- [ ] Accessibility: All templates have proper labels
- [ ] Haptic feedback on selection (existing pattern)

### UI/UX Design

**Integration Point**: Enhance existing `MorningIntentionScreen.tsx`

```
┌─────────────────────────────────────────┐
│  Good Morning! 🌅                       │
│  What's your intention for today?       │
├─────────────────────────────────────────┤
│                                         │
│  Quick Intentions:                      │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 🎯  Stay present in each moment │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 📞  Reach out to my sponsor     │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 🙏  Practice gratitude          │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 🏠  Attend a meeting            │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┐   │
│    ✏️  Or write your own...        │   │
│  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  How are you feeling? 😊        │   │
│  │  ○ ○ ○ ● ○   (4/5)              │   │
│  └─────────────────────────────────┘   │
│                                         │
│         [ Continue → ]                  │
└─────────────────────────────────────────┘
```

### Technical Implementation

**Files to Modify**:
```
apps/mobile/src/
├── constants/
│   └── intentionTemplates.ts           # NEW - Template definitions
├── features/home/
│   ├── screens/
│   │   └── MorningIntentionScreen.tsx  # MODIFY - Add template picker
│   └── components/
│       └── IntentionTemplatePicker.tsx # NEW - Template grid component
```

**Template Data Structure**:
```typescript
// apps/mobile/src/constants/intentionTemplates.ts
export interface IntentionTemplate {
  id: string;
  emoji: string;
  text: string;
  category: 'presence' | 'connection' | 'gratitude' | 'action' | 'growth';
  stepAlignment?: number; // Which step this relates to (1-12)
}

export const INTENTION_TEMPLATES: IntentionTemplate[] = [
  { id: 'present', emoji: '🎯', text: 'Stay present in each moment', category: 'presence' },
  { id: 'sponsor', emoji: '📞', text: 'Reach out to my sponsor', category: 'connection', stepAlignment: 5 },
  { id: 'gratitude', emoji: '🙏', text: 'Practice gratitude today', category: 'gratitude', stepAlignment: 10 },
  { id: 'meeting', emoji: '🏠', text: 'Attend a meeting', category: 'action' },
  { id: 'oneday', emoji: '📅', text: 'Take it one day at a time', category: 'presence', stepAlignment: 1 },
  { id: 'help', emoji: '🤝', text: 'Help another person', category: 'connection', stepAlignment: 12 },
  { id: 'honest', emoji: '💎', text: 'Be honest in all my affairs', category: 'growth', stepAlignment: 4 },
  { id: 'selfcare', emoji: '💚', text: 'Practice self-care', category: 'growth' },
  { id: 'prayer', emoji: '🙏', text: 'Seek conscious contact with HP', category: 'presence', stepAlignment: 11 },
  { id: 'amends', emoji: '🕊️', text: 'Make amends where needed', category: 'action', stepAlignment: 9 },
  { id: 'inventory', emoji: '📝', text: 'Take personal inventory', category: 'growth', stepAlignment: 10 },
  { id: 'service', emoji: '🌟', text: 'Be of service to others', category: 'connection', stepAlignment: 12 },
];

/**
 * Get shuffled templates for today (deterministic based on date)
 */
export function getTodaysTemplates(count: number = 6): IntentionTemplate[] {
  const today = new Date().toISOString().split('T')[0];
  const seed = today.split('-').reduce((acc, n) => acc + parseInt(n), 0);
  
  // Fisher-Yates shuffle with seed
  const shuffled = [...INTENTION_TEMPLATES];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = (seed * (i + 1)) % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled.slice(0, count);
}
```

**Component Implementation**:
```typescript
// apps/mobile/src/features/home/components/IntentionTemplatePicker.tsx
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { cn } from '@/lib/utils';
import { getTodaysTemplates, type IntentionTemplate } from '@/constants/intentionTemplates';

interface IntentionTemplatePickerProps {
  onSelect: (template: IntentionTemplate) => void;
  onCustomPress: () => void;
  selectedId?: string;
}

export function IntentionTemplatePicker({
  onSelect,
  onCustomPress,
  selectedId,
}: IntentionTemplatePickerProps): React.ReactElement {
  const templates = getTodaysTemplates(6);

  const handleSelect = (template: IntentionTemplate): void => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect(template);
  };

  return (
    <View className="gap-3">
      <Text className="text-slate-400 text-sm font-medium mb-1">
        Quick Intentions
      </Text>
      
      {templates.map((template, index) => (
        <Animated.View
          key={template.id}
          entering={FadeInUp.delay(index * 50).duration(300)}
        >
          <TouchableOpacity
            onPress={() => handleSelect(template)}
            className={cn(
              'flex-row items-center p-4 rounded-xl border',
              selectedId === template.id
                ? 'bg-purple-600/20 border-purple-500'
                : 'bg-slate-800/50 border-slate-700'
            )}
            accessibilityLabel={`Set intention: ${template.text}`}
            accessibilityRole="button"
            accessibilityState={{ selected: selectedId === template.id }}
          >
            <Text className="text-2xl mr-3">{template.emoji}</Text>
            <Text className={cn(
              'flex-1 text-base',
              selectedId === template.id ? 'text-purple-300' : 'text-white'
            )}>
              {template.text}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      ))}

      <TouchableOpacity
        onPress={onCustomPress}
        className="flex-row items-center p-4 rounded-xl border border-dashed border-slate-600"
        accessibilityLabel="Write your own intention"
        accessibilityRole="button"
      >
        <Text className="text-2xl mr-3">✏️</Text>
        <Text className="text-slate-400 text-base">Or write your own...</Text>
      </TouchableOpacity>
    </View>
  );
}
```

### Metrics to Track (Local Only)
- Template selection rate vs custom text
- Most popular templates (anonymized)
- Morning check-in completion rate change
- Time to complete check-in (target: <30 seconds)

### BMAD Checkpoints
- [ ] **BUILD**: Templates added to MorningIntentionScreen
- [ ] **MEASURE**: Local analytics tracking completion rates
- [ ] **ANALYZE**: 1-week data review for template popularity
- [ ] **DECIDE**: Adjust template set based on usage patterns

---

## 1.2 Yesterday's Wins Reminder

### Priority & Sizing
- **Priority**: P0 (Critical for habit reinforcement)
- **Size**: Small (1 day)
- **Dependencies**: None
- **Risk**: Low

### User Story
> As a user starting my morning, I want to see what I was grateful for yesterday, so I can begin my day with a positive mindset and remember my progress.

### Acceptance Criteria
- [ ] Show yesterday's gratitude/wins at top of morning check-in
- [ ] Graceful fallback if no yesterday entry exists
- [ ] Decrypt and display securely
- [ ] Dismissible with "Got it" button
- [ ] Subtle animation on appearance
- [ ] Skip if user already viewed today

### UI/UX Design

**Integration Point**: Top of `MorningIntentionScreen.tsx` before intention input

```
┌─────────────────────────────────────────┐
│  Good Morning! 🌅                       │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 💫 Yesterday's Win              │   │
│  │                                 │   │
│  │ "I'm grateful for my sponsor   │   │
│  │  calling to check on me"       │   │
│  │                                 │   │
│  │           [ Got it ✓ ]         │   │
│  └─────────────────────────────────┘   │
│                                         │
│  What's your intention for today?       │
│  ...                                    │
└─────────────────────────────────────────┘
```

### Technical Implementation

**Files to Modify**:
```
apps/mobile/src/features/home/
├── screens/
│   └── MorningIntentionScreen.tsx  # MODIFY - Add wins reminder
├── components/
│   └── YesterdaysWinsCard.tsx      # NEW - Wins display card
└── hooks/
    └── useDailyCheckIns.ts         # MODIFY - Add getYesterdayGratitude
```

**Hook Addition**:
```typescript
// Add to useDailyCheckIns.ts
export function useYesterdayGratitude(userId: string) {
  const { db } = useDatabase();

  return useQuery({
    queryKey: ['yesterday-gratitude', userId],
    queryFn: async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const dateStr = yesterday.toISOString().split('T')[0];

      const checkIn = await db?.getFirstAsync<{ encrypted_gratitude: string | null }>(
        `SELECT encrypted_gratitude FROM daily_checkins 
         WHERE user_id = ? AND check_in_date = ? AND check_in_type = 'evening'`,
        [userId, dateStr]
      );

      if (!checkIn?.encrypted_gratitude) return null;

      return await decryptContent(checkIn.encrypted_gratitude);
    },
    enabled: !!db && !!userId,
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });
}
```

**Component**:
```typescript
// apps/mobile/src/features/home/components/YesterdaysWinsCard.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { Card } from '@/design-system/components';
import * as Haptics from 'expo-haptics';

interface YesterdaysWinsCardProps {
  gratitude: string;
  onDismiss: () => void;
}

export function YesterdaysWinsCard({ 
  gratitude, 
  onDismiss 
}: YesterdaysWinsCardProps): React.ReactElement {
  const [dismissed, setDismissed] = useState(false);

  const handleDismiss = (): void => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDismissed(true);
    onDismiss();
  };

  if (dismissed) return <></>;

  return (
    <Animated.View entering={FadeInDown.duration(400)} exiting={FadeOutUp}>
      <Card variant="elevated" className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 border-amber-700/50 mb-6">
        <View className="flex-row items-center mb-2">
          <Text className="text-xl mr-2">💫</Text>
          <Text className="text-amber-400 font-semibold">Yesterday's Win</Text>
        </View>
        
        <Text className="text-white text-base leading-relaxed mb-4">
          "{gratitude}"
        </Text>

        <TouchableOpacity
          onPress={handleDismiss}
          className="self-end bg-amber-600/20 px-4 py-2 rounded-lg"
          accessibilityLabel="Dismiss yesterday's win reminder"
          accessibilityRole="button"
        >
          <Text className="text-amber-400 font-medium">Got it ✓</Text>
        </TouchableOpacity>
      </Card>
    </Animated.View>
  );
}
```

### BMAD Checkpoints
- [ ] **BUILD**: Card integrated into morning flow
- [ ] **MEASURE**: Track dismiss vs ignore rate
- [ ] **ANALYZE**: Does showing wins increase completion?
- [ ] **DECIDE**: Adjust prominence based on feedback

---

## 1.3 Streak Grace Period

### Priority & Sizing
- **Priority**: P1 (Important for retention)
- **Size**: Small (1 day)
- **Dependencies**: None
- **Risk**: Low

### User Story
> As a user who missed one day due to life circumstances, I want forgiveness in my streak tracking, so I don't feel demoralized and give up entirely. Recovery is about progress, not perfection.

### Acceptance Criteria
- [ ] Grant 1 "grace skip" per 30-day streak
- [ ] Grace skip auto-applied on first missed day
- [ ] Visual indicator when grace was used
- [ ] Grace period resets after 30 consecutive days
- [ ] Store grace usage in local database
- [ ] Encouraging message when grace is used

### UI/UX Design

**Streak Display with Grace Indicator**:
```
┌─────────────────────────────────────────┐
│  Your Streaks 🔥                        │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  📓 Journal Streak              │   │
│  │                                 │   │
│  │      18 days  🔥                │   │
│  │                                 │   │
│  │  ┌─────────────────────────┐   │   │
│  │  │ 💫 Grace used Jan 25    │   │   │
│  │  │ Progress, not perfection │   │   │
│  │  └─────────────────────────┘   │   │
│  │                                 │   │
│  │  Grace available in: 12 days   │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

**Grace Applied Toast**:
```
┌─────────────────────────────────────────┐
│  💫 Grace Applied                       │
│                                         │
│  We noticed you missed yesterday.       │
│  Your streak is protected.              │
│                                         │
│  Recovery is about progress,            │
│  not perfection. Keep going! 💪         │
│                                         │
│              [ Continue ]               │
└─────────────────────────────────────────┘
```

### Technical Implementation

**Database Schema Addition** (Migration v9):
```sql
-- Add to user_streaks tracking
ALTER TABLE achievements ADD COLUMN grace_used_at TEXT;
ALTER TABLE achievements ADD COLUMN grace_available INTEGER DEFAULT 1;
```

**Grace Logic**:
```typescript
// apps/mobile/src/services/streakService.ts

interface StreakWithGrace {
  currentStreak: number;
  longestStreak: number;
  graceAvailable: boolean;
  graceUsedAt: string | null;
  daysUntilGraceReset: number;
}

export function calculateStreakWithGrace(
  entries: { date: string }[],
  existingGraceUsedAt: string | null
): StreakWithGrace {
  const today = new Date().toISOString().split('T')[0];
  const sortedDates = entries.map(e => e.date).sort().reverse();
  
  let currentStreak = 0;
  let graceUsed = false;
  let graceUsedAt = existingGraceUsedAt;
  
  const checkDate = new Date(today);
  
  for (let i = 0; i < 365; i++) {
    const dateStr = checkDate.toISOString().split('T')[0];
    const hasEntry = sortedDates.includes(dateStr);
    
    if (hasEntry) {
      currentStreak++;
    } else if (!graceUsed && currentStreak >= 7) {
      // Apply grace for streaks of 7+ days
      graceUsed = true;
      graceUsedAt = dateStr;
      currentStreak++; // Count the grace day
    } else {
      break; // Streak broken
    }
    
    checkDate.setDate(checkDate.getDate() - 1);
  }
  
  // Grace resets after 30 consecutive days from when it was used
  const graceAvailable = !graceUsedAt || 
    (new Date().getTime() - new Date(graceUsedAt).getTime()) > 30 * 24 * 60 * 60 * 1000;
  
  const daysUntilGraceReset = graceUsedAt
    ? Math.max(0, 30 - Math.floor((new Date().getTime() - new Date(graceUsedAt).getTime()) / (24 * 60 * 60 * 1000)))
    : 0;
  
  return {
    currentStreak,
    longestStreak: Math.max(currentStreak, /* fetch from db */),
    graceAvailable,
    graceUsedAt,
    daysUntilGraceReset,
  };
}
```

### BMAD Checkpoints
- [ ] **BUILD**: Grace logic implemented in streak calculation
- [ ] **MEASURE**: Track grace usage frequency
- [ ] **ANALYZE**: Does grace prevent churn after missed days?
- [ ] **DECIDE**: Adjust grace period length (7d? 14d? 30d?)

---

## 1.4 Evening Reflection Templates

### Priority & Sizing
- **Priority**: P1 (Important for evening engagement)
- **Size**: Small (1 day)
- **Dependencies**: 1.1 (reuse template pattern)
- **Risk**: Low

### User Story
> As a user completing my evening check-in, I want guided reflection prompts to help me process my day, especially when I'm tired and don't know what to write.

### Acceptance Criteria
- [ ] 6 reflection prompt templates on evening check-in
- [ ] Templates tie to 12-step principles (especially Step 10)
- [ ] HALT-aware prompts (Hungry, Angry, Lonely, Tired)
- [ ] User can still write freely
- [ ] Templates rotate weekly

### Reflection Templates
```typescript
export const REFLECTION_TEMPLATES = [
  { id: 'inventory', emoji: '📝', text: 'What was I wrong about today?', stepAlignment: 10 },
  { id: 'gratitude', emoji: '🙏', text: 'What three things am I grateful for?', category: 'gratitude' },
  { id: 'amends', emoji: '🕊️', text: 'Is there anyone I owe an apology to?', stepAlignment: 10 },
  { id: 'growth', emoji: '🌱', text: 'How did I grow today?', category: 'growth' },
  { id: 'halt', emoji: '🛑', text: 'HALT check: Was I hungry, angry, lonely, or tired?', category: 'selfcare' },
  { id: 'helping', emoji: '🤝', text: 'How was I of service to others?', stepAlignment: 12 },
  { id: 'honest', emoji: '💎', text: 'Where was I dishonest today?', stepAlignment: 10 },
  { id: 'fear', emoji: '🦁', text: 'What fears came up today?', stepAlignment: 4 },
];
```

---

## 1.5 "On This Day" Memories

### Priority & Sizing
- **Priority**: P2 (Nice to have)
- **Size**: Small (1 day)
- **Dependencies**: Journal entries > 30 days old
- **Risk**: Low

### User Story
> As a user with historical journal entries, I want to see what I wrote on this day in the past, so I can reflect on my growth and remember my journey.

### Acceptance Criteria
- [ ] Show "On This Day" card if entry exists from 1 year, 6 months, or 3 months ago
- [ ] Decrypt and display entry snippet (first 100 chars)
- [ ] Tap to view full entry
- [ ] Only show if user has sufficient history
- [ ] Encouraging context about growth

### UI/UX Design
```
┌─────────────────────────────────────────┐
│  📅 On This Day                         │
├─────────────────────────────────────────┤
│                                         │
│  1 Year Ago (Jan 30, 2025)              │
│  ─────────────────────────              │
│  "Today I admitted I was powerless.     │
│  It's scary but also freeing..."        │
│                                         │
│  Look how far you've come! 💪           │
│                                         │
│         [ Read Full Entry ]             │
└─────────────────────────────────────────┘
```

---

# 🏆 SPRINT 2: Gamification & Progress
**Timeline**: Week 3-4  
**Goal**: Reinforce positive behaviors through visible progress

---

## 2.1 Multi-Streak Tracking System

### Priority & Sizing
- **Priority**: P0 (Critical for retention)
- **Size**: Medium (3-4 days)
- **Dependencies**: Sprint 1 features
- **Risk**: Medium (requires schema changes)

### User Story
> As a user building recovery habits, I want to see my consistency across all recovery activities (journal, check-ins, meetings, step work), so I feel motivated to maintain a holistic recovery program.

### Acceptance Criteria
- [ ] Track 5 streak types: sobriety, journal, check-in, meeting, step work
- [ ] Show current streak + personal best for each
- [ ] Calculate streaks locally (offline-first)
- [ ] Sync streak achievements to Supabase
- [ ] Visual streak indicators on dashboard
- [ ] Streak broken notification (compassionate tone)

### Streak Types Definition
| Streak | Criteria | Grace Eligible |
|--------|----------|----------------|
| **Sobriety** | Days since sobriety date | No (use relapse flow) |
| **Journal** | Consecutive days with ≥1 entry | Yes (7+ days) |
| **Check-in** | Consecutive days with morning + evening | Yes (7+ days) |
| **Meeting** | Weeks with ≥1 meeting logged | Yes (4+ weeks) |
| **Step Work** | Consecutive days with step progress | Yes (7+ days) |

### UI/UX Design

**Dashboard Integration**:
```
┌─────────────────────────────────────────┐
│  Your Recovery Streaks 🔥               │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────┐ ┌───────┐ ┌───────┐        │
│  │  42   │ │  18   │ │  23   │        │
│  │  🎯   │ │  📓   │ │  ✓✓   │        │
│  │ Sober │ │Journal│ │Checkin│        │
│  │ days  │ │ days  │ │ days  │        │
│  └───────┘ └───────┘ └───────┘        │
│                                         │
│  ┌───────┐ ┌───────┐                   │
│  │   8   │ │   5   │                   │
│  │  🏠   │ │  📖   │                   │
│  │Meeting│ │ Steps │                   │
│  │ weeks │ │ days  │                   │
│  └───────┘ └───────┘                   │
│                                         │
│  🏅 Personal Best: 67 day journal streak │
└─────────────────────────────────────────┘
```

### Technical Implementation

**Extend Achievements Table** (Migration v9):
```sql
-- Add streak tracking columns to achievements
ALTER TABLE achievements ADD COLUMN streak_type TEXT;
ALTER TABLE achievements ADD COLUMN current_streak INTEGER DEFAULT 0;
ALTER TABLE achievements ADD COLUMN longest_streak INTEGER DEFAULT 0;
ALTER TABLE achievements ADD COLUMN last_activity_date TEXT;
ALTER TABLE achievements ADD COLUMN grace_used_at TEXT;
ALTER TABLE achievements ADD COLUMN grace_available INTEGER DEFAULT 1;

-- Create index for streak queries
CREATE INDEX IF NOT EXISTS idx_achievements_streak ON achievements(user_id, streak_type);
```

**Streak Service**:
```typescript
// apps/mobile/src/services/streakService.ts
import type { StorageAdapter } from '@/adapters/storage';
import { logger } from '@/utils/logger';

export type StreakType = 'sobriety' | 'journal' | 'checkin' | 'meeting' | 'stepwork';

export interface StreakData {
  type: StreakType;
  current: number;
  longest: number;
  lastActivityDate: string | null;
  graceAvailable: boolean;
  graceUsedAt: string | null;
  unit: 'days' | 'weeks';
}

export interface AllStreaks {
  sobriety: StreakData;
  journal: StreakData;
  checkin: StreakData;
  meeting: StreakData;
  stepwork: StreakData;
}

export async function calculateAllStreaks(
  db: StorageAdapter,
  userId: string,
  sobrietyDate: string
): Promise<AllStreaks> {
  const today = new Date().toISOString().split('T')[0];
  
  // Sobriety streak (from profile)
  const sobrietyDays = Math.floor(
    (new Date(today).getTime() - new Date(sobrietyDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  // Journal streak
  const journalEntries = await db.getAllAsync<{ created_at: string }>(
    `SELECT DISTINCT date(created_at) as created_at FROM journal_entries 
     WHERE user_id = ? ORDER BY created_at DESC LIMIT 365`,
    [userId]
  );
  const journalStreak = calculateDayStreak(journalEntries.map(e => e.created_at));

  // Check-in streak (both morning AND evening required)
  const checkinDates = await db.getAllAsync<{ check_in_date: string }>(
    `SELECT check_in_date FROM daily_checkins 
     WHERE user_id = ? 
     GROUP BY check_in_date 
     HAVING COUNT(DISTINCT check_in_type) = 2
     ORDER BY check_in_date DESC LIMIT 365`,
    [userId]
  );
  const checkinStreak = calculateDayStreak(checkinDates.map(e => e.check_in_date));

  // Meeting streak (weekly)
  const meetingWeeks = await db.getAllAsync<{ week: string }>(
    `SELECT strftime('%Y-%W', created_at) as week FROM favorite_meetings 
     WHERE user_id = ? GROUP BY week ORDER BY week DESC LIMIT 52`,
    [userId]
  );
  const meetingStreak = calculateWeekStreak(meetingWeeks.map(e => e.week));

  // Step work streak
  const stepDates = await db.getAllAsync<{ updated_at: string }>(
    `SELECT DISTINCT date(updated_at) as updated_at FROM step_work 
     WHERE user_id = ? AND encrypted_answer IS NOT NULL
     ORDER BY updated_at DESC LIMIT 365`,
    [userId]
  );
  const stepStreak = calculateDayStreak(stepDates.map(e => e.updated_at));

  return {
    sobriety: { type: 'sobriety', current: sobrietyDays, longest: sobrietyDays, lastActivityDate: today, graceAvailable: false, graceUsedAt: null, unit: 'days' },
    journal: { type: 'journal', current: journalStreak, longest: journalStreak, lastActivityDate: journalEntries[0]?.created_at ?? null, graceAvailable: true, graceUsedAt: null, unit: 'days' },
    checkin: { type: 'checkin', current: checkinStreak, longest: checkinStreak, lastActivityDate: checkinDates[0]?.check_in_date ?? null, graceAvailable: true, graceUsedAt: null, unit: 'days' },
    meeting: { type: 'meeting', current: meetingStreak, longest: meetingStreak, lastActivityDate: meetingWeeks[0]?.week ?? null, graceAvailable: true, graceUsedAt: null, unit: 'weeks' },
    stepwork: { type: 'stepwork', current: stepStreak, longest: stepStreak, lastActivityDate: stepDates[0]?.updated_at ?? null, graceAvailable: true, graceUsedAt: null, unit: 'days' },
  };
}

function calculateDayStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < dates.length; i++) {
    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - i);
    const expectedStr = expectedDate.toISOString().split('T')[0];
    
    if (dates.includes(expectedStr)) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

function calculateWeekStreak(weeks: string[]): number {
  if (weeks.length === 0) return 0;
  
  // Implementation for week-based streaks
  // Similar logic but comparing ISO week strings
  return weeks.length; // Simplified
}
```

**Hook**:
```typescript
// apps/mobile/src/features/home/hooks/useStreaks.ts
import { useQuery } from '@tanstack/react-query';
import { useDatabase } from '@/contexts/DatabaseContext';
import { useAuth } from '@/contexts/AuthContext';
import { calculateAllStreaks, type AllStreaks } from '@/services/streakService';

export function useStreaks() {
  const { db, isReady } = useDatabase();
  const { user } = useAuth();

  return useQuery<AllStreaks>({
    queryKey: ['streaks', user?.id],
    queryFn: async () => {
      if (!db || !user?.id) throw new Error('Not ready');
      
      // Get sobriety date from profile
      const profile = await db.getFirstAsync<{ sobriety_start_date: string }>(
        'SELECT sobriety_start_date FROM user_profile WHERE id = ?',
        [user.id]
      );
      
      if (!profile?.sobriety_start_date) {
        throw new Error('Sobriety date not set');
      }
      
      return calculateAllStreaks(db, user.id, profile.sobriety_start_date);
    },
    enabled: isReady && !!user?.id,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}
```

### BMAD Checkpoints
- [ ] **BUILD**: Streak calculation service complete
- [ ] **MEASURE**: Track which streaks users maintain longest
- [ ] **ANALYZE**: Correlation between streaks and retention
- [ ] **DECIDE**: Adjust streak visibility/prominence

---

## 2.2 Visual Progress Rings

### Priority & Sizing
- **Priority**: P1 (Important for visualization)
- **Size**: Medium (2-3 days)
- **Dependencies**: 2.1 Multi-Streak System
- **Risk**: Low

### User Story
> As a user viewing my dashboard, I want Apple Watch-style progress rings showing my daily completion, so I have a quick visual indicator of how I'm doing today.

### Acceptance Criteria
- [ ] 3 concentric rings: Check-in, Journal, Step Work
- [ ] Rings fill based on daily completion
- [ ] Smooth animation on load and updates
- [ ] Accessible with screen reader descriptions
- [ ] Tap ring to go to that feature

### UI/UX Design
```
         ┌───────────────┐
       ╱╱                 ╲╲
      ╱   ┌───────────┐     ╲
     ╱   ╱             ╲     ╲
    │   │   ┌───────┐   │   │
    │   │   │ Today │   │   │
    │   │   │  75%  │   │   │
    │   │   └───────┘   │   │
     ╲   ╲             ╱     ╱
      ╲   └───────────┘     ╱
       ╲╲                 ╱╱
         └───────────────┘
    
    ● Check-in (100%)  ● Journal (50%)  ● Steps (75%)
```

### Technical Implementation

Using `react-native-svg` for custom ring animation:

```typescript
// apps/mobile/src/features/home/components/ProgressRings.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import Animated, { useAnimatedProps, withTiming, useSharedValue } from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface RingData {
  progress: number; // 0-1
  color: string;
  label: string;
  onPress: () => void;
}

interface ProgressRingsProps {
  rings: RingData[];
  size?: number;
}

export function ProgressRings({ rings, size = 200 }: ProgressRingsProps): React.ReactElement {
  const strokeWidth = 12;
  const gap = 4;
  
  return (
    <View className="items-center">
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${size/2}, ${size/2}`}>
          {rings.map((ring, index) => {
            const radius = (size / 2) - (strokeWidth / 2) - (index * (strokeWidth + gap));
            const circumference = 2 * Math.PI * radius;
            const progress = useSharedValue(0);
            
            React.useEffect(() => {
              progress.value = withTiming(ring.progress, { duration: 1000 });
            }, [ring.progress]);
            
            const animatedProps = useAnimatedProps(() => ({
              strokeDashoffset: circumference * (1 - progress.value),
            }));
            
            return (
              <React.Fragment key={ring.label}>
                {/* Background ring */}
                <Circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke={`${ring.color}30`}
                  strokeWidth={strokeWidth}
                  fill="none"
                />
                {/* Progress ring */}
                <AnimatedCircle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke={ring.color}
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeDasharray={circumference}
                  animatedProps={animatedProps}
                  strokeLinecap="round"
                />
              </React.Fragment>
            );
          })}
        </G>
      </Svg>
      
      {/* Center label */}
      <View className="absolute inset-0 items-center justify-center">
        <Text className="text-3xl font-bold text-white">
          {Math.round(rings.reduce((sum, r) => sum + r.progress, 0) / rings.length * 100)}%
        </Text>
        <Text className="text-slate-400 text-sm">Today</Text>
      </View>
      
      {/* Legend */}
      <View className="flex-row gap-4 mt-4">
        {rings.map(ring => (
          <TouchableOpacity
            key={ring.label}
            onPress={ring.onPress}
            className="flex-row items-center"
            accessibilityLabel={`${ring.label}: ${Math.round(ring.progress * 100)}% complete`}
          >
            <View className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: ring.color }} />
            <Text className="text-slate-300 text-sm">{ring.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
```

---

## 2.3 Achievement Celebration Animations

### Priority & Sizing
- **Priority**: P2 (Nice to have)
- **Size**: Small (1 day)
- **Dependencies**: None (enhance existing)
- **Risk**: Low

### User Story
> As a user who just reached a milestone, I want a tasteful celebration animation, so I feel acknowledged for my progress without it being overwhelming.

### Implementation
Enhance existing `AnimatedCheckmark` with optional confetti effect:

```typescript
// Enhance apps/mobile/src/design-system/components/AnimatedCheckmark.tsx
// Add confetti option for milestone celebrations

export function MilestoneCelebration({ 
  milestone, 
  onComplete 
}: { milestone: string; onComplete: () => void }) {
  return (
    <View className="flex-1 items-center justify-center bg-slate-900/95">
      <LottieView
        source={require('@/assets/animations/confetti.json')}
        autoPlay
        loop={false}
        style={{ width: 300, height: 300, position: 'absolute' }}
      />
      <AnimatedCheckmark size={120} color="#10b981" />
      <Text className="text-3xl font-bold text-white mt-8">{milestone}</Text>
      <Text className="text-slate-400 text-lg mt-2">Keep going, you're doing great!</Text>
      <Button onPress={onComplete} className="mt-8">Continue</Button>
    </View>
  );
}
```

---

## 2.4 Yearly Engagement Heatmap

### Priority & Sizing
- **Priority**: P2 (Nice to have)
- **Size**: Medium (2-3 days)
- **Dependencies**: 2.1 Multi-Streak System
- **Risk**: Low

### User Story
> As a user wanting to see my long-term consistency, I want a GitHub-style contribution heatmap showing my daily engagement over the past year.

### UI/UX Design
```
┌─────────────────────────────────────────┐
│  Your Year in Recovery                  │
├─────────────────────────────────────────┤
│                                         │
│  Jan Feb Mar Apr May Jun Jul Aug Sep... │
│  ■ ■ ■ □ ■ ■ ■ ■ ■ □ ■ ■ ■ ■ ■ ■ □ ■  │
│  ■ ■ ■ ■ ■ □ ■ ■ ■ ■ ■ ■ ■ ■ □ ■ ■ ■  │
│  ■ □ ■ ■ ■ ■ ■ □ ■ ■ ■ ■ ■ ■ ■ ■ ■ □  │
│  ... (7 rows for days of week)         │
│                                         │
│  □ None  ▪ Low  ▪ Medium  ■ High       │
│                                         │
│  285 days of engagement this year       │
└─────────────────────────────────────────┘
```

---

## 2.5 Shareable Milestone Cards

### Priority & Sizing
- **Priority**: P2 (Nice to have)
- **Size**: Medium (2 days)
- **Dependencies**: None
- **Risk**: Low (privacy-safe by design)

### User Story
> As a user celebrating a milestone, I want to generate a shareable image card that shows my achievement without revealing any personal recovery data.

### Privacy-Safe Design
- Card shows ONLY: milestone name, days count, generic encouragement
- NO: username, specific dates, journal content, meeting info
- Generated as image (not link to app)

### UI/UX Design
```
┌─────────────────────────────────────────┐
│                                         │
│      🎉 MILESTONE ACHIEVED 🎉           │
│                                         │
│           ╭─────────────╮               │
│           │     30      │               │
│           │    DAYS     │               │
│           ╰─────────────╯               │
│                                         │
│    "One day at a time becomes          │
│     one month at a time"               │
│                                         │
│         Steps to Recovery              │
│                                         │
└─────────────────────────────────────────┘
```

---

# 📊 SPRINT 3: Analytics & Insights
**Timeline**: Week 5-6  
**Goal**: Help users understand their patterns and progress

---

## 3.1 Mood Trend Visualization

### Priority & Sizing
- **Priority**: P0 (Critical for insight)
- **Size**: Medium (3 days)
- **Dependencies**: 30+ days of check-in data
- **Risk**: Low

### User Story
> As a user tracking my recovery, I want to see my mood trends over time, so I can identify patterns and understand what affects my emotional wellbeing.

### Acceptance Criteria
- [ ] Line chart showing 30-day mood average
- [ ] Week-over-week comparison
- [ ] Highlight trend direction (up/down/stable)
- [ ] All analysis done locally (never sent to server)
- [ ] Accessible chart descriptions

### UI/UX Design

**Integration Point**: Enhance `ProgressDashboardScreen.tsx`

```
┌─────────────────────────────────────────┐
│  📈 Mood Trend (Last 30 Days)           │
├─────────────────────────────────────────┤
│                                         │
│  10 ┤                                   │
│   8 ┤        ╭─╮     ╭──╮              │
│   6 ┤  ╭─╮╭──╯ ╰─╮╭──╯  ╰──╮          │
│   4 ┤╭─╯ ╰╯      ╰╯        ╰─         │
│   2 ┤                                   │
│   0 ┼───────────────────────────────   │
│       W1    W2    W3    W4    W5       │
│                                         │
│  Average: 6.2  ↑ +0.8 from last month  │
│                                         │
└─────────────────────────────────────────┘
```

### Technical Implementation

**Analytics Hook**:
```typescript
// apps/mobile/src/features/progress/hooks/useAnalytics.ts
import { useQuery } from '@tanstack/react-query';
import { useDatabase } from '@/contexts/DatabaseContext';
import { useAuth } from '@/contexts/AuthContext';
import { decryptContent } from '@/utils/encryption';

interface MoodTrendData {
  date: string;
  avgMood: number;
}

interface MoodAnalytics {
  trend: MoodTrendData[];
  currentAverage: number;
  previousAverage: number;
  change: number;
  direction: 'up' | 'down' | 'stable';
}

export function useMoodAnalytics(days: number = 30) {
  const { db, isReady } = useDatabase();
  const { user } = useAuth();

  return useQuery<MoodAnalytics>({
    queryKey: ['mood-analytics', user?.id, days],
    queryFn: async () => {
      if (!db || !user?.id) throw new Error('Not ready');
      
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const checkIns = await db.getAllAsync<{
        check_in_date: string;
        encrypted_mood: string;
      }>(
        `SELECT check_in_date, encrypted_mood FROM daily_checkins 
         WHERE user_id = ? AND check_in_date >= ? AND encrypted_mood IS NOT NULL
         ORDER BY check_in_date ASC`,
        [user.id, startDate.toISOString().split('T')[0]]
      );
      
      // Decrypt moods and aggregate by week
      const weeklyData: Map<string, number[]> = new Map();
      
      for (const checkIn of checkIns) {
        const mood = parseInt(await decryptContent(checkIn.encrypted_mood), 10);
        const weekKey = getWeekKey(checkIn.check_in_date);
        
        if (!weeklyData.has(weekKey)) {
          weeklyData.set(weekKey, []);
        }
        weeklyData.get(weekKey)!.push(mood);
      }
      
      const trend: MoodTrendData[] = Array.from(weeklyData.entries()).map(([week, moods]) => ({
        date: week,
        avgMood: moods.reduce((a, b) => a + b, 0) / moods.length,
      }));
      
      // Calculate averages
      const allMoods = checkIns.length > 0 
        ? await Promise.all(checkIns.map(c => decryptContent(c.encrypted_mood).then(m => parseInt(m, 10))))
        : [];
      
      const currentAverage = allMoods.length > 0 
        ? allMoods.reduce((a, b) => a + b, 0) / allMoods.length 
        : 0;
      
      // Get previous period for comparison
      const previousAverage = await getPreviousPeriodAverage(db, user.id, days);
      
      const change = currentAverage - previousAverage;
      const direction = change > 0.5 ? 'up' : change < -0.5 ? 'down' : 'stable';
      
      return {
        trend,
        currentAverage,
        previousAverage,
        change,
        direction,
      };
    },
    enabled: isReady && !!user?.id,
    staleTime: 1000 * 60 * 30, // Cache for 30 minutes
  });
}

function getWeekKey(dateStr: string): string {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const week = Math.ceil((date.getDate() + new Date(year, date.getMonth(), 1).getDay()) / 7);
  return `${year}-W${week}`;
}

async function getPreviousPeriodAverage(
  db: StorageAdapter, 
  userId: string, 
  days: number
): Promise<number> {
  // Implementation to get previous period's average
  return 0; // Placeholder
}
```

---

## 3.2 Craving Pattern Analysis

### Priority & Sizing
- **Priority**: P0 (Critical for relapse prevention)
- **Size**: Medium (2-3 days)
- **Dependencies**: 3.1 Mood Trend
- **Risk**: Low

### User Story
> As a user tracking my cravings, I want to see patterns by day of week and time of day, so I can prepare for my high-risk periods.

### Acceptance Criteria
- [ ] Identify highest craving day of week
- [ ] Identify highest craving time of day
- [ ] Show craving trend over time
- [ ] Highlight if craving is decreasing (positive reinforcement)
- [ ] Local-only analysis

### UI/UX Design
```
┌─────────────────────────────────────────┐
│  🔥 Craving Patterns                    │
├─────────────────────────────────────────┤
│                                         │
│  ⚠️  Highest Risk Times                 │
│  ┌─────────────────────────────────┐   │
│  │ Fridays, 6:00 PM - 9:00 PM      │   │
│  │ Average craving: 6.2/10         │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ✅ Lowest Risk Times                   │
│  ┌─────────────────────────────────┐   │
│  │ Sunday mornings                 │   │
│  │ Average craving: 2.1/10         │   │
│  └─────────────────────────────────┘   │
│                                         │
│  📉 Overall Trend: Down 15% this month │
│                                         │
└─────────────────────────────────────────┘
```

---

## 3.3 Correlation Insights Engine

### Priority & Sizing
- **Priority**: P1 (Important for awareness)
- **Size**: Large (4-5 days)
- **Dependencies**: 3.1, 3.2
- **Risk**: Medium (statistical analysis complexity)

### User Story
> As a user seeking self-understanding, I want the app to identify correlations between my activities and my wellbeing, so I can make informed decisions about my recovery behaviors.

### Insight Types
| Insight | Example |
|---------|---------|
| Meeting correlation | "Your mood is 23% higher on days you attend meetings" |
| Journal correlation | "Journaling in the morning correlates with lower evening cravings" |
| Sleep pattern | "Your mood is higher after consistent evening check-ins" |
| Step work impact | "Working on steps correlates with higher weekly mood averages" |

### Implementation
```typescript
// apps/mobile/src/features/progress/utils/correlationAnalysis.ts

interface Insight {
  id: string;
  type: 'meeting' | 'journal' | 'checkin' | 'stepwork';
  message: string;
  correlation: number; // -1 to 1
  confidence: 'low' | 'medium' | 'high';
  dataPoints: number;
}

export function analyzeCorrelations(
  checkIns: DecryptedCheckIn[],
  journalEntries: { date: string }[],
  meetings: { date: string }[],
  stepWork: { date: string }[]
): Insight[] {
  const insights: Insight[] = [];
  
  // Meeting correlation with mood
  const meetingDates = new Set(meetings.map(m => m.date));
  const moodOnMeetingDays = checkIns
    .filter(c => meetingDates.has(c.date))
    .map(c => c.mood);
  const moodOnNonMeetingDays = checkIns
    .filter(c => !meetingDates.has(c.date))
    .map(c => c.mood);
  
  if (moodOnMeetingDays.length >= 5 && moodOnNonMeetingDays.length >= 5) {
    const meetingAvg = average(moodOnMeetingDays);
    const nonMeetingAvg = average(moodOnNonMeetingDays);
    const diff = ((meetingAvg - nonMeetingAvg) / nonMeetingAvg) * 100;
    
    if (Math.abs(diff) > 10) {
      insights.push({
        id: 'meeting-mood',
        type: 'meeting',
        message: `Your mood is ${Math.round(Math.abs(diff))}% ${diff > 0 ? 'higher' : 'lower'} on days you attend meetings`,
        correlation: diff / 100,
        confidence: moodOnMeetingDays.length >= 10 ? 'high' : 'medium',
        dataPoints: moodOnMeetingDays.length,
      });
    }
  }
  
  // Journal correlation with craving
  // ... similar analysis
  
  return insights.filter(i => i.confidence !== 'low');
}

function average(nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}
```

---

## 3.4 Weekly Recovery Report

### Priority & Sizing
- **Priority**: P1 (Important for reflection)
- **Size**: Medium (2-3 days)
- **Dependencies**: 3.1-3.3
- **Risk**: Low

### User Story
> As a user wanting regular reflection, I want a weekly summary of my recovery activities and progress, so I can celebrate wins and identify areas for growth.

### Report Contents
- Week at a glance: Check-ins completed, entries written, meetings attended
- Mood summary: Average, trend, high/low days
- Craving summary: Average, patterns
- Streaks: Current status for all tracked streaks
- Insights: Key correlations discovered
- Encouragement: Personalized based on progress

### Storage
Use existing `weekly_reports` table (schema v8):
```sql
weekly_reports (
  id, user_id, week_start, week_end, report_json, created_at
)
```

---

## 3.5 PDF Export Enhancement

### Priority & Sizing
- **Priority**: P2 (Nice to have)
- **Size**: Medium (2-3 days)
- **Dependencies**: 3.4 Weekly Report
- **Risk**: Low

### User Story
> As a user sharing progress with a sponsor or therapist, I want to export my weekly report as a PDF, so I can share my progress in a professional format.

### Implementation
Use `react-native-pdf-lib` or `expo-print` for PDF generation.

---

# 🛡️ SPRINT 4: Proactive Support
**Timeline**: Week 7-8  
**Goal**: Detect risk patterns and provide proactive support

---

## 4.1 Pattern-Based Gentle Nudges

### Priority & Sizing
- **Priority**: P0 (Critical for crisis prevention)
- **Size**: Large (4-5 days)
- **Dependencies**: 3.3 Correlation Insights
- **Risk**: Medium (must be non-intrusive)

### User Story
> As a user going through a difficult period, I want the app to gently check on me if it notices concerning patterns, so I feel supported without being judged.

### Detection Patterns
| Pattern | Threshold | Nudge |
|---------|-----------|-------|
| Declining mood | 3+ days of decreasing mood | "We noticed some tough days. Would you like to try a breathing exercise?" |
| Rising cravings | Craving avg > 6 for 3+ days | "Cravings have been high lately. Remember: this too shall pass. Want to review your motivation vault?" |
| Missed check-ins | 2+ missed after consistent streak | "Haven't seen you in a bit. Everything okay? No pressure - just checking in." |
| High single craving | Any craving > 8 | Immediate gentle offer: "That sounds really hard. Would you like some support right now?" |

### Critical Design Principles
1. **Never accusatory** - Always compassionate, curious, supportive
2. **Always optional** - Easy to dismiss, never blocking
3. **No external reporting** - All analysis stays on device
4. **Respect privacy** - Never mention specific content
5. **Action-oriented** - Always offer concrete help (breathing, tools, contacts)

### UI/UX Design

**Gentle Nudge Modal**:
```
┌─────────────────────────────────────────┐
│                                         │
│           💙                            │
│                                         │
│  Checking In                            │
│                                         │
│  We noticed things have been            │
│  challenging lately.                    │
│                                         │
│  Remember: recovery isn't about         │
│  perfection. It's about progress.       │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 🌬️  Try a breathing exercise   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 💪  View my motivation vault    │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 📞  Call my sponsor             │   │
│  └─────────────────────────────────┘   │
│                                         │
│         [ I'm okay, thanks ]            │
│                                         │
└─────────────────────────────────────────┘
```

### Technical Implementation

**Nudge Service**:
```typescript
// apps/mobile/src/services/nudgeService.ts
import type { StorageAdapter } from '@/adapters/storage';
import { decryptContent } from '@/utils/encryption';

export interface NudgeType {
  id: string;
  type: 'declining_mood' | 'rising_craving' | 'missed_checkins' | 'high_craving';
  title: string;
  message: string;
  severity: 'gentle' | 'concerned' | 'urgent';
  actions: NudgeAction[];
}

export interface NudgeAction {
  id: string;
  label: string;
  icon: string;
  route?: string;
  action?: 'call_sponsor' | 'breathing' | 'vault' | 'crisis';
}

export async function checkForNudges(
  db: StorageAdapter,
  userId: string
): Promise<NudgeType | null> {
  const today = new Date();
  const threeDaysAgo = new Date(today);
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  
  // Get recent check-ins
  const recentCheckIns = await db.getAllAsync<{
    check_in_date: string;
    encrypted_mood: string | null;
    encrypted_craving: string | null;
  }>(
    `SELECT check_in_date, encrypted_mood, encrypted_craving 
     FROM daily_checkins 
     WHERE user_id = ? AND check_in_date >= ?
     ORDER BY check_in_date DESC`,
    [userId, threeDaysAgo.toISOString().split('T')[0]]
  );
  
  // Check for high immediate craving (most urgent)
  const todayCheckIn = recentCheckIns.find(c => 
    c.check_in_date === today.toISOString().split('T')[0]
  );
  
  if (todayCheckIn?.encrypted_craving) {
    const craving = parseInt(await decryptContent(todayCheckIn.encrypted_craving), 10);
    if (craving >= 8) {
      return {
        id: 'high_craving_immediate',
        type: 'high_craving',
        title: 'Checking In',
        message: 'That sounds really hard. Would you like some support right now?',
        severity: 'urgent',
        actions: [
          { id: 'breathing', label: 'Try breathing exercises', icon: '🌬️', action: 'breathing' },
          { id: 'crisis', label: 'Emergency resources', icon: '🆘', action: 'crisis' },
          { id: 'sponsor', label: 'Call my sponsor', icon: '📞', action: 'call_sponsor' },
        ],
      };
    }
  }
  
  // Check for declining mood trend
  if (recentCheckIns.length >= 3) {
    const moods = await Promise.all(
      recentCheckIns
        .filter(c => c.encrypted_mood)
        .slice(0, 3)
        .map(c => decryptContent(c.encrypted_mood!).then(m => parseInt(m, 10)))
    );
    
    // Check if mood is consistently declining
    const isDecreasing = moods.length >= 3 && 
      moods[0] < moods[1] && moods[1] < moods[2];
    
    if (isDecreasing && moods[0] <= 4) {
      return {
        id: 'declining_mood',
        type: 'declining_mood',
        title: 'Checking In',
        message: "We noticed some tough days. Remember: recovery isn't about perfection. It's about progress.",
        severity: 'gentle',
        actions: [
          { id: 'breathing', label: 'Try a breathing exercise', icon: '🌬️', action: 'breathing' },
          { id: 'vault', label: 'View my motivation vault', icon: '💪', action: 'vault' },
          { id: 'sponsor', label: 'Call my sponsor', icon: '📞', action: 'call_sponsor' },
        ],
      };
    }
  }
  
  // Check for missed check-ins (after having a streak)
  // ... implementation
  
  return null; // No nudge needed
}
```

**Nudge Hook**:
```typescript
// apps/mobile/src/hooks/useNudge.ts
import { useEffect, useState } from 'react';
import { useDatabase } from '@/contexts/DatabaseContext';
import { useAuth } from '@/contexts/AuthContext';
import { checkForNudges, type NudgeType } from '@/services/nudgeService';

export function useNudge() {
  const { db, isReady } = useDatabase();
  const { user } = useAuth();
  const [nudge, setNudge] = useState<NudgeType | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    async function check() {
      if (!db || !user?.id || dismissed) return;
      
      const result = await checkForNudges(db, user.id);
      setNudge(result);
    }
    
    check();
  }, [db, user?.id, dismissed]);

  const dismiss = () => {
    setDismissed(true);
    setNudge(null);
  };

  return { nudge, dismiss };
}
```

### BMAD Checkpoints
- [ ] **BUILD**: Nudge detection and UI complete
- [ ] **MEASURE**: Track nudge frequency and action taken
- [ ] **ANALYZE**: Are nudges helping or annoying users?
- [ ] **DECIDE**: Adjust thresholds based on feedback

---

## 4.2 Enhanced Breathing Exercises

### Priority & Sizing
- **Priority**: P1 (Important for crisis support)
- **Size**: Medium (2-3 days)
- **Dependencies**: None (enhance existing)
- **Risk**: Low

### User Story
> As a user in crisis or experiencing cravings, I want multiple breathing exercise options with clear guidance, so I can choose what works best for me in the moment.

### Breathing Patterns
| Pattern | Inhale | Hold | Exhale | Hold | Best For |
|---------|--------|------|--------|------|----------|
| **4-7-8 (Relaxing)** | 4s | 7s | 8s | - | Anxiety, sleep |
| **Box (Grounding)** | 4s | 4s | 4s | 4s | Cravings, panic |
| **Calm (Simple)** | 4s | - | 6s | - | Beginners, stress |
| **Energize** | 4s | - | 2s | - | Low energy, focus |

### UI Enhancement

Build on existing `BreathingCircle` component:

```typescript
// apps/mobile/src/constants/breathingPatterns.ts
export interface BreathingPattern {
  id: string;
  name: string;
  description: string;
  phases: BreathingPhase[];
  cycles: number;
  bestFor: string[];
}

export interface BreathingPhase {
  name: 'inhale' | 'holdIn' | 'exhale' | 'holdOut';
  duration: number; // seconds
  instruction: string;
}

export const BREATHING_PATTERNS: BreathingPattern[] = [
  {
    id: '4-7-8',
    name: '4-7-8 Relaxing Breath',
    description: 'A natural tranquilizer for the nervous system',
    phases: [
      { name: 'inhale', duration: 4, instruction: 'Breathe in through your nose' },
      { name: 'holdIn', duration: 7, instruction: 'Hold your breath' },
      { name: 'exhale', duration: 8, instruction: 'Exhale slowly through your mouth' },
    ],
    cycles: 4,
    bestFor: ['Anxiety', 'Sleep', 'Cravings'],
  },
  {
    id: 'box',
    name: 'Box Breathing',
    description: 'Used by Navy SEALs to stay calm under pressure',
    phases: [
      { name: 'inhale', duration: 4, instruction: 'Breathe in' },
      { name: 'holdIn', duration: 4, instruction: 'Hold' },
      { name: 'exhale', duration: 4, instruction: 'Breathe out' },
      { name: 'holdOut', duration: 4, instruction: 'Hold' },
    ],
    cycles: 4,
    bestFor: ['Panic', 'Cravings', 'Focus'],
  },
  {
    id: 'calm',
    name: 'Simple Calm',
    description: 'Easy breathing for beginners',
    phases: [
      { name: 'inhale', duration: 4, instruction: 'Breathe in slowly' },
      { name: 'exhale', duration: 6, instruction: 'Breathe out slowly' },
    ],
    cycles: 6,
    bestFor: ['Stress', 'Beginners', 'Anytime'],
  },
];
```

---

## 4.3 5-4-3-2-1 Grounding Enhancement

### Priority & Sizing
- **Priority**: P1 (Important for crisis support)
- **Size**: Medium (2 days)
- **Dependencies**: None (enhance existing)
- **Risk**: Low

### User Story
> As a user feeling dissociated or overwhelmed, I want a guided grounding exercise that brings me back to the present moment through my senses.

### Implementation
Enhance existing grounding in `EmergencyScreen`:

```typescript
// apps/mobile/src/features/emergency/components/GroundingExercise.tsx
const GROUNDING_STEPS = [
  { count: 5, sense: 'see', prompt: 'Name 5 things you can SEE', emoji: '👁️', examples: ['the wall', 'your phone', 'a light'] },
  { count: 4, sense: 'touch', prompt: 'Name 4 things you can TOUCH', emoji: '✋', examples: ['your chair', 'your clothes', 'the floor'] },
  { count: 3, sense: 'hear', prompt: 'Name 3 things you can HEAR', emoji: '👂', examples: ['traffic', 'your breathing', 'a fan'] },
  { count: 2, sense: 'smell', prompt: 'Name 2 things you can SMELL', emoji: '👃', examples: ['air', 'food', 'soap'] },
  { count: 1, sense: 'taste', prompt: 'Name 1 thing you can TASTE', emoji: '👅', examples: ['coffee', 'mint', 'water'] },
];
```

---

## 4.4 Safety Plan Builder

### Priority & Sizing
- **Priority**: P0 (Critical for safety)
- **Size**: Large (4-5 days)
- **Dependencies**: None
- **Risk**: Medium (sensitive content)

### User Story
> As a user who wants to prepare for difficult moments, I want to create a personal safety plan with my warning signs, coping strategies, and emergency contacts, so I have a clear action plan when I'm struggling.

### Safety Plan Components
1. **Warning Signs** - Personal triggers and early warning signs
2. **Coping Strategies** - Things that have helped before
3. **Reasons to Stay Sober** - Personal motivations
4. **Support Contacts** - People I can call (sponsor, friends, family)
5. **Professional Help** - Therapist, crisis lines
6. **Environment Safety** - Making my environment safer

### UI/UX Design
```
┌─────────────────────────────────────────┐
│  🛡️ My Safety Plan                      │
├─────────────────────────────────────────┤
│                                         │
│  1. Warning Signs                       │
│  ┌─────────────────────────────────┐   │
│  │ • Isolating from friends        │   │
│  │ • Skipping meetings             │   │
│  │ • Not sleeping well             │   │
│  │ + Add warning sign              │   │
│  └─────────────────────────────────┘   │
│                                         │
│  2. Coping Strategies                   │
│  ┌─────────────────────────────────┐   │
│  │ • Call my sponsor               │   │
│  │ • Go for a walk                 │   │
│  │ • Breathing exercises           │   │
│  │ + Add strategy                  │   │
│  └─────────────────────────────────┘   │
│                                         │
│  3. My Support People                   │
│  ┌─────────────────────────────────┐   │
│  │ 📞 Sponsor: John (tap to call)  │   │
│  │ 📞 Friend: Sarah                │   │
│  │ + Add contact                   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [ View Full Plan ] [ Edit Plan ]       │
└─────────────────────────────────────────┘
```

### Database Schema (Migration v9)
```sql
CREATE TABLE IF NOT EXISTS safety_plan (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  section TEXT NOT NULL, -- 'warning_signs', 'coping', 'reasons', 'contacts', 'professional', 'environment'
  encrypted_content TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user_profile(id)
);

CREATE INDEX IF NOT EXISTS idx_safety_plan_user ON safety_plan(user_id, section);
```

---

## 4.5 Trigger Inventory System

### Priority & Sizing
- **Priority**: P1 (Important for relapse prevention)
- **Size**: Medium (2-3 days)
- **Dependencies**: 4.4 Safety Plan
- **Risk**: Low

### User Story
> As a user working on my recovery, I want to identify and track my personal triggers, so I can recognize and prepare for high-risk situations.

### Trigger Categories
- **People**: Who triggers cravings?
- **Places**: Where do I feel triggered?
- **Things**: Objects or activities that trigger
- **Emotions**: Feelings that lead to cravings
- **Times**: Days/times when cravings are highest

---

## 4.6 Quick Action Cards

### Priority & Sizing
- **Priority**: P2 (Nice to have)
- **Size**: Small (1-2 days)
- **Dependencies**: 4.4, 4.5
- **Risk**: Low

### User Story
> As a user facing a specific trigger, I want quick-access action cards tailored to that trigger, so I have immediate guidance on what to do.

### Example Action Cards
```
┌─────────────────────────────────────────┐
│  🍺 Triggered by: Social Drinking       │
├─────────────────────────────────────────┤
│                                         │
│  Quick Actions:                         │
│                                         │
│  1. ☎️  Call your sponsor NOW           │
│  2. 🚪  Leave the environment           │
│  3. 🌬️  Do 4-7-8 breathing             │
│  4. 💭  Play the tape forward           │
│  5. 🏠  Find a meeting nearby           │
│                                         │
│  Remember: You've handled this before.  │
│  You can do it again.                   │
│                                         │
└─────────────────────────────────────────┘
```

---

## 4.7 HALT Check-in

### Priority & Sizing
- **Priority**: P1 (Important for self-awareness)
- **Size**: Small (1 day)
- **Dependencies**: None
- **Risk**: Low

### User Story
> As a user experiencing discomfort, I want a quick HALT check (Hungry, Angry, Lonely, Tired) to help me identify what I'm really feeling before I act on a craving.

### UI/UX Design
```
┌─────────────────────────────────────────┐
│  🛑 HALT Check                          │
├─────────────────────────────────────────┤
│                                         │
│  Before acting on a craving, check in:  │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 🍽️  Am I HUNGRY?          [ ] │   │
│  │     → Eat something healthy     │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 😤  Am I ANGRY?           [ ] │   │
│  │     → Journal about it          │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 🥺  Am I LONELY?          [ ] │   │
│  │     → Call someone              │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 😴  Am I TIRED?           [ ] │   │
│  │     → Rest or take a break      │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Often, cravings are actually about    │
│  unmet basic needs.                    │
│                                         │
└─────────────────────────────────────────┘
```

---

# 📐 Database Migration Plan

## Migration v9: Feature Enhancements

```sql
-- Migration v9: Feature Enhancement Tables
-- Run after schema v8

-- 1. Extend achievements for streak tracking
ALTER TABLE achievements ADD COLUMN IF NOT EXISTS streak_type TEXT;
ALTER TABLE achievements ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0;
ALTER TABLE achievements ADD COLUMN IF NOT EXISTS longest_streak INTEGER DEFAULT 0;
ALTER TABLE achievements ADD COLUMN IF NOT EXISTS last_activity_date TEXT;
ALTER TABLE achievements ADD COLUMN IF NOT EXISTS grace_used_at TEXT;
ALTER TABLE achievements ADD COLUMN IF NOT EXISTS grace_available INTEGER DEFAULT 1;

-- 2. Safety plan table
CREATE TABLE IF NOT EXISTS safety_plan (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  section TEXT NOT NULL,
  encrypted_content TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user_profile(id)
);

-- 3. Trigger inventory table
CREATE TABLE IF NOT EXISTS trigger_inventory (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  category TEXT NOT NULL, -- 'people', 'places', 'things', 'emotions', 'times'
  encrypted_description TEXT NOT NULL,
  intensity INTEGER DEFAULT 5, -- 1-10
  encrypted_coping_plan TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user_profile(id)
);

-- 4. Nudge history (to avoid repeating)
CREATE TABLE IF NOT EXISTS nudge_history (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  nudge_type TEXT NOT NULL,
  shown_at TEXT NOT NULL,
  action_taken TEXT, -- 'dismissed', 'breathing', 'vault', 'sponsor', 'crisis'
  FOREIGN KEY (user_id) REFERENCES user_profile(id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_achievements_streak ON achievements(user_id, streak_type);
CREATE INDEX IF NOT EXISTS idx_safety_plan_user ON safety_plan(user_id, section);
CREATE INDEX IF NOT EXISTS idx_trigger_inventory_user ON trigger_inventory(user_id, category);
CREATE INDEX IF NOT EXISTS idx_nudge_history_user ON nudge_history(user_id, nudge_type);
```

---

# ✅ Quality Checklist

## Before Each Feature (Pre-Build)
- [ ] Review CLAUDE.md patterns
- [ ] Check existing similar implementations
- [ ] Verify database schema compatibility
- [ ] Plan encryption for sensitive fields
- [ ] Design accessibility requirements

## During Build
- [ ] TypeScript strict mode (no `any`)
- [ ] All sensitive data encrypted with `encryptContent()`
- [ ] Accessibility props on all interactive elements
- [ ] Use design system components
- [ ] Follow feature folder structure

## After Build (Pre-Merge)
- [ ] Run `npm run test:encryption`
- [ ] Run `npx tsc --noEmit`
- [ ] Test offline mode
- [ ] Test screen reader
- [ ] Manual smoke test in Expo Go
- [ ] Update this tracker with completion status

---

# 📈 Success Metrics

## Primary KPIs
| Metric | Baseline | Sprint 2 Target | Sprint 4 Target |
|--------|----------|-----------------|-----------------|
| D1 Retention | TBD | 60% | 70% |
| D7 Retention | TBD | 40% | 50% |
| D30 Retention | TBD | 20% | 30% |
| Daily Check-in Rate | TBD | 50% | 70% |
| Journal Entries/Week | TBD | 3 | 5 |

## Feature-Specific Metrics
| Feature | Metric | Target |
|---------|--------|--------|
| Intention Templates | Template vs Custom rate | 60% template |
| Streaks | Avg streak length | 14 days |
| Breathing | Crisis tool usage | 80% completion |
| Nudges | Action taken rate | 40% engagement |
| Safety Plan | Completion rate | 70% of users |

---

# 🔄 BMAD Cycle Schedule

| Week | Phase | Activities |
|------|-------|------------|
| 1-2 | **BUILD** Sprint 1 | Implement daily engagement features |
| 3 | **MEASURE** | Collect local usage data |
| 3 | **ANALYZE** | Review completion rates, identify issues |
| 3 | **DECIDE** | Adjust Sprint 2 priorities |
| 3-4 | **BUILD** Sprint 2 | Implement gamification features |
| 5 | **MEASURE** | Collect streak and engagement data |
| 5 | **ANALYZE** | Review retention impact |
| 5 | **DECIDE** | Adjust Sprint 3-4 priorities |
| 5-6 | **BUILD** Sprint 3 | Implement analytics features |
| 7-8 | **BUILD** Sprint 4 | Implement proactive support |
| 9 | **FULL REVIEW** | Comprehensive analysis and iteration |

---

*Document Version: 1.0*  
*Last Updated: January 30, 2026*  
*Next Review: After Sprint 1 completion*
