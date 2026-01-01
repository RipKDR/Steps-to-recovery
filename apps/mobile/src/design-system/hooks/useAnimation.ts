/**
 * Animation helper hooks
 * Provides reusable animation patterns using React Native Animated API
 */

import { useRef, useEffect } from 'react';
import { Animated } from 'react-native';
import { springConfigs, timingDurations, easingCurves } from '../tokens/animations';

/**
 * Fade-in animation hook
 * Animates opacity from 0 to 1 on mount
 *
 * @param delay - Delay before animation starts (ms)
 * @returns Animated value for opacity
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const fadeAnim = useFadeIn(0);
 *
 *   return (
 *     <Animated.View style={{ opacity: fadeAnim }}>
 *       <Text>I fade in!</Text>
 *     </Animated.View>
 *   );
 * }
 * ```
 */
export function useFadeIn(delay: number = 0) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.spring(fadeAnim, {
        toValue: 1,
        ...springConfigs.default,
      }).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [fadeAnim, delay]);

  return fadeAnim;
}

/**
 * Scale animation hook
 * Animates scale from initial value to 1 on mount
 *
 * @param initialScale - Starting scale value (default: 0.95)
 * @param delay - Delay before animation starts (ms)
 * @returns Animated value for scale transform
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const scaleAnim = useScaleIn(0.9, 100);
 *
 *   return (
 *     <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
 *       <Text>I scale in!</Text>
 *     </Animated.View>
 *   );
 * }
 * ```
 */
export function useScaleIn(initialScale: number = 0.95, delay: number = 0) {
  const scaleAnim = useRef(new Animated.Value(initialScale)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        ...springConfigs.default,
      }).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [scaleAnim, delay]);

  return scaleAnim;
}

/**
 * Press animation hook
 * Provides scale animation for press interactions
 *
 * @returns Object with scaleAnim value and animatePress function
 *
 * @example
 * ```tsx
 * function MyButton() {
 *   const { scaleAnim, animatePress } = usePressAnimation();
 *
 *   return (
 *     <Pressable
 *       onPressIn={() => animatePress(true)}
 *       onPressOut={() => animatePress(false)}
 *     >
 *       <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
 *         <Text>Press me!</Text>
 *       </Animated.View>
 *     </Pressable>
 *   );
 * }
 * ```
 */
export function usePressAnimation(pressScale: number = 0.98) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const animatePress = (isPressed: boolean) => {
    Animated.spring(scaleAnim, {
      toValue: isPressed ? pressScale : 1,
      ...springConfigs.gentle,
    }).start();
  };

  return { scaleAnim, animatePress };
}

/**
 * Bounce animation hook
 * Provides a bounce effect that can be triggered
 *
 * @returns Object with scaleAnim value and bounce function
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { scaleAnim, bounce } = useBounceAnimation();
 *
 *   const handlePress = () => {
 *     bounce();
 *     // Other press logic...
 *   };
 *
 *   return (
 *     <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
 *       <Button onPress={handlePress} title="Bounce!" />
 *     </Animated.View>
 *   );
 * }
 * ```
 */
export function useBounceAnimation(bounceScale: number = 1.15) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const bounce = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: bounceScale,
        ...springConfigs.bouncy,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        ...springConfigs.bouncy,
      }),
    ]).start();
  };

  return { scaleAnim, bounce };
}

/**
 * Slide-in animation hook
 * Animates translateY from offset to 0
 *
 * @param offset - Initial Y offset (default: 50)
 * @param delay - Delay before animation starts (ms)
 * @returns Animated value for translateY transform
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const slideAnim = useSlideIn(100, 200);
 *
 *   return (
 *     <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
 *       <Text>I slide up!</Text>
 *     </Animated.View>
 *   );
 * }
 * ```
 */
export function useSlideIn(offset: number = 50, delay: number = 0) {
  const slideAnim = useRef(new Animated.Value(offset)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.spring(slideAnim, {
        toValue: 0,
        ...springConfigs.default,
      }).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [slideAnim, delay, offset]);

  return slideAnim;
}

/**
 * Combined fade + scale animation hook
 * Animates both opacity and scale for a premium entrance effect
 *
 * @param delay - Delay before animation starts (ms)
 * @returns Object with fadeAnim and scaleAnim values
 *
 * @example
 * ```tsx
 * function MyCard() {
 *   const { fadeAnim, scaleAnim } = useFadeAndScaleIn(0);
 *
 *   return (
 *     <Animated.View style={{
 *       opacity: fadeAnim,
 *       transform: [{ scale: scaleAnim }]
 *     }}>
 *       <Text>I fade and scale in!</Text>
 *     </Animated.View>
 *   );
 * }
 * ```
 */
export function useFadeAndScaleIn(delay: number = 0) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.spring(fadeAnim, {
          toValue: 1,
          ...springConfigs.default,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          ...springConfigs.default,
        }),
      ]).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, delay]);

  return { fadeAnim, scaleAnim };
}

/**
 * Number counter animation hook
 * Animates a number from start to end value
 *
 * @param start - Starting number
 * @param end - Ending number
 * @param duration - Animation duration in ms
 * @returns Animated value that interpolates between start and end
 *
 * @example
 * ```tsx
 * function Counter({ value }: { value: number }) {
 *   const animatedValue = useNumberAnimation(0, value, 500);
 *
 *   return (
 *     <Animated.Text>
 *       {animatedValue.interpolate({
 *         inputRange: [0, value],
 *         outputRange: [0, value],
 *       })}
 *     </Animated.Text>
 *   );
 * }
 * ```
 */
export function useNumberAnimation(start: number, end: number, duration: number = 500) {
  const animValue = useRef(new Animated.Value(start)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: end,
      duration,
      easing: easingCurves.easeOut,
      useNativeDriver: true,
    }).start();
  }, [animValue, end, duration]);

  return animValue;
}
