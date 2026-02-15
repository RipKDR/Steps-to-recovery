# Performance Optimizations Applied

## Summary

This document tracks performance optimizations applied to the Steps to Recovery mobile app based on the performance audit report (PERFORMANCE_REPORT.md).

## Completed Optimizations

### 1. Heavy Computation in Render - AmendsTracker.tsx ✅

**Issue**: Line 85 was filtering the entries array on every render to count completed entries.

**Fix**:
```typescript
// Before
<Text className="text-gray-500 text-sm">
  {entries.filter((e) => e.status === 'complete').length} of {entries.length} complete
</Text>

// After
const completedCount = useMemo(
  () => entries.filter((e) => e.status === 'complete').length,
  [entries]
);

<Text className="text-gray-500 text-sm">
  {completedCount} of {entries.length} complete
</Text>
```

**Impact**: 
- Prevents unnecessary array filtering on every render
- O(n) operation moved to memoized value that only recalculates when entries change
- Particularly beneficial when the entries list is large

**Additional improvements**:
- Added `useCallback` to `handleAdd` and `toggleStatus` functions to prevent recreation on every render

### 2. Star Imports Optimization - expo-haptics (18 files) ✅

**Issue**: 18 files used star imports (`import * as Haptics from 'expo-haptics'`) which prevents effective tree-shaking.

**Fix**: Replaced with named imports
```typescript
// Before
import * as Haptics from 'expo-haptics';
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

// After
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
impactAsync(ImpactFeedbackStyle.Medium);
```

**Files Updated**:
1. BiometricLockScreen.tsx
2. ChapterCard.tsx
3. ContactCard.tsx
4. ReflectionCard.tsx
5. CapsuleCard.tsx
6. AmendsCard.tsx
7. MeetingCard.tsx
8. InventoryEntryCard.tsx
9. SharePrepCard.tsx
10. ReviewCard.tsx
11. Slider.tsx
12. StatsRow.tsx
13. DailyReadingCard.tsx
14. UpcomingMeetingWidget.tsx
15. SponsorWidget.tsx
16. EmptyState.tsx
17. CrisisButton.tsx
18. PhoneWidget.tsx

**Impact**:
- Better tree-shaking (webpack/metro can eliminate unused exports)
- Estimated bundle size reduction: 5-10KB per file (18 files = ~90-180KB total)
- Faster cold start time due to smaller bundle

## Pending High-Impact Optimizations

### 3. Full-Text Search (FTS) for Encrypted Memories - useMemoryStore.ts

**Issue**: The `searchMemories` function currently:
1. Fetches ALL memories from the database
2. Decrypts ALL memories
3. Filters in JavaScript using `.includes()`

This is O(n) with expensive decryption operations and becomes slow with >100 memories.

**Current Code** (apps/mobile/src/hooks/useMemoryStore.ts:268-300):
```typescript
const searchMemories = useCallback(
  async (query: string): Promise<Memory[]> => {
    if (!db || !isReady || !query.trim()) return [];

    try {
      // NOTE: Search on encrypted columns won't work
      // TODO: Future optimization - use FTS (Full-Text Search) with encrypted index
      const rows = await db.getAllAsync<MemoryRow>(
        'SELECT * FROM memories WHERE user_id = ? ORDER BY confidence DESC, created_at DESC',
        [userId],
      );

      const memories = await Promise.all(rows.map(rowToMemory));

      const lowerQuery = query.toLowerCase();
      return memories
        .filter(
          (m) =>
            m.content.toLowerCase().includes(lowerQuery) ||
            (m.context && m.context.toLowerCase().includes(lowerQuery)),
        )
        .slice(0, 20);
    }
    // ...
  }
);
```

**Recommended Solution**:

Option A: **Hybrid Encrypted FTS** (Recommended for MVP)
- Store searchable keywords/tags separately (unencrypted or with deterministic encryption)
- Use SQLite FTS5 for keyword search
- Fetch only matching encrypted memories for full decryption
- Complexity: Medium | Impact: High | Security: Good (keywords only, not full content)

```typescript
// Pseudocode
CREATE VIRTUAL TABLE memory_search USING fts5(
  memory_id, keywords, tags
);

// When adding memory
const keywords = extractKeywords(memory.content); // "sponsor", "craving", "meeting"
await db.runAsync(
  'INSERT INTO memory_search (memory_id, keywords) VALUES (?, ?)',
  [memory.id, keywords.join(' ')]
);

// When searching
const matchingIds = await db.getAllAsync(
  'SELECT memory_id FROM memory_search WHERE memory_search MATCH ?',
  [query]
);
// Only decrypt memories with matching IDs
```

Option B: **Client-Side Indexed Search** (Simpler, less secure)
- Use a JavaScript search library (lunr.js, FlexSearch)
- Build in-memory index on app start (decrypt once, keep plaintext index in memory)
- Trade-off: Memory overhead, security risk if memory dump
- Complexity: Low | Impact: High | Security: Moderate

Option C: **Semantic Search with Embeddings** (Future enhancement)
- Generate embeddings for memories using local AI model
- Store embeddings (not searchable directly, but can do similarity search)
- Requires significant architecture changes
- Complexity: Very High | Impact: Very High | Security: Excellent

**Recommendation**: Start with Option A (Hybrid Encrypted FTS). Extract 5-10 non-sensitive keywords per memory (e.g., "sponsor", "meeting", "step 4") for FTS indexing, keep full content encrypted.

**Estimated Impact**:
- Search time: O(n) → O(log n) + O(k) where k = matching results
- With 1000 memories:
  - Current: ~3-5 seconds (1000 decryptions + filter)
  - Optimized: ~100-300ms (FTS query + ~20 decryptions)
- 10-20x faster for typical searches

### 4. FlatList → FlashList Migration (13 instances)

**Current Status**: 13 components use FlatList, 1 uses FlashList (MeetingFinderScreen ✅)

**Recommendation**: Migrate to FlashList for lists with >10 items:

**High Priority (Long lists, frequently scrolled)**:
- ChatScreen.tsx - message history can be 100+ items
- ConversationList.tsx - conversation threads
- StepReviewScreen.tsx - review entries
- FavoriteMeetingsScreen.tsx - favorite meetings list

**Medium Priority**:
- StepDetailQuestionsList.tsx - questions per step
- DistractionPicker.tsx - distraction activities list

**Low Priority (Short lists < 10 items)**:
- AmendsTracker.tsx - typically 5-15 entries
- Most other component usage

**Migration Example**:
```typescript
// Before
import { FlatList } from 'react-native';
<FlatList
  data={messages}
  renderItem={({ item }) => <MessageItem message={item} />}
  keyExtractor={(item) => item.id}
/>

// After
import { FlashList } from '@shopify/flash-list';
<FlashList
  data={messages}
  renderItem={({ item }) => <MessageItem message={item} />}
  keyExtractor={(item) => item.id}
  estimatedItemSize={80} // Add estimated item height for better performance
/>
```

**Impact**:
- 2-3x faster scroll performance
- Reduced memory usage through view recycling
- Smoother 60fps scrolling on lower-end devices

### 5. Large File Refactoring (101 files >300 lines)

**Top Priority Files** (>400 lines):
1. indexeddb.ts (473 lines) - Database adapter
2. PhoneWidget.tsx (510 lines) - Phone call tracking widget
3. UpcomingMeetingWidget.tsx (501 lines) - Meeting widget
4. MeetingCard.tsx (484 lines) - Meeting display card
5. SponsorWidget.tsx (476 lines) - Sponsor connection widget

**Recommendation**: 
- Extract sub-components into separate files
- Move utility functions to dedicated util files
- Split complex components into smaller, focused components
- Example: PhoneWidget → PhoneWidget (main) + ProgressBar + QuickCallButton + CallHistory

**Impact**:
- Better code maintainability
- Easier testing (smaller units)
- Improved tree-shaking (only import what's needed)
- Potential for lazy-loading sub-components

### 6. Code Splitting for Heavy Screens

**Recommendation**: Lazy-load non-critical screens using React.lazy()

**Candidate Screens** (loaded but not immediately needed):
- MeetingFinderScreen.tsx
- ChatScreen.tsx (AI companion)
- JournalListScreen.tsx (if using infinite scroll)
- ProgressDashboardScreen.tsx

**Example**:
```typescript
// Before
import MeetingFinderScreen from './screens/MeetingFinderScreen';

// After
const MeetingFinderScreen = lazy(() => import('./screens/MeetingFinderScreen'));

// In navigation
<Suspense fallback={<LoadingScreen />}>
  <MeetingFinderScreen />
</Suspense>
```

**Impact**:
- Reduced initial bundle size
- Faster cold start (defer loading until screen is accessed)
- Estimated: 200-400ms faster cold start

### 7. Image Optimization

**Current Status**: Need to verify expo-image usage across the app

**Recommendation**:
- Use `expo-image` instead of React Native `Image` component
- Enable disk caching with `cachePolicy="memory-disk"`
- Use proper `contentFit` and `transition` props
- Lazy-load off-screen images

**Example**:
```typescript
import { Image } from 'expo-image';

<Image
  source={{ uri: imageUrl }}
  style={styles.image}
  contentFit="cover"
  transition={200}
  cachePolicy="memory-disk"
  placeholder={blurhash}
/>
```

**Impact**:
- Faster image loading
- Reduced memory usage
- Better user experience with cached images

### 8. Bundle Size Analysis

**Recommendation**: Run bundle analysis to identify large dependencies

```bash
# Generate bundle analysis
node scripts/analyze-bundle.js

# Check for:
# - Large dependencies (>100KB)
# - Duplicate dependencies
# - Unused code
# - Opportunities for lazy loading
```

**Known Large Dependencies**:
- @tanstack/react-query
- react-native-reanimated
- expo-sqlite
- @shopify/flash-list
- crypto-js

**Optimization Opportunities**:
- Consider lighter alternatives for rarely-used features
- Lazy-load Sentry SDK (only when error occurs)
- Use babel-plugin-lodash for tree-shaking (if using lodash)
- Split vendor bundle from main app bundle

## Testing Checklist

Before deploying optimizations to production:

- [ ] Run `npm test` - all tests passing
- [ ] Test AmendsTracker with 50+ entries (verify no performance regression)
- [ ] Test haptic feedback on all 18 updated components
- [ ] Run bundle analysis before/after
- [ ] Measure cold start time before/after (target: <2s)
- [ ] Test on low-end device (e.g., iPhone 8, mid-range Android)
- [ ] Profile memory usage (target: <128MB)
- [ ] Test offline sync performance with large datasets
- [ ] Run E2E tests to ensure no regressions

## Performance Budget Targets

| Metric      | Target  | Current | Status |
| ----------- | ------- | ------- | ------ |
| Bundle Size | < 4MB   | TBD     | ⚪     |
| Cold Start  | < 2s    | TBD     | ⚪     |
| Screen Load | < 300ms | TBD     | ⚪     |
| List Scroll | 60 FPS  | TBD     | ⚪     |
| Memory      | < 128MB | TBD     | ⚪     |

## Monitoring

**Key Metrics to Track**:
- Bundle size (track over time)
- Cold start duration (p50, p95)
- Screen transition time
- Memory usage (average, peak)
- Scroll FPS (average)
- JavaScript heap size

**Tools**:
- React DevTools Profiler
- React Native Performance Monitor
- Flipper
- Sentry Performance Monitoring
- Bundle analyzer

## Resources

- [Performance Audit Report](PERFORMANCE_REPORT.md)
- [React Native Performance Guide](https://reactnative.dev/docs/performance)
- [FlashList Documentation](https://shopify.github.io/flash-list/)
- [Expo Image Documentation](https://docs.expo.dev/versions/latest/sdk/image/)
- [React Optimization Guide](https://react.dev/reference/react/memo)

## Notes

- Performance optimizations should be measured, not assumed
- Always profile before and after changes
- Focus on user-perceived performance (cold start, screen transitions)
- Don't over-optimize - diminishing returns after hitting targets
- Security > Performance (never compromise encryption for speed)
