import React from 'react';
import RNSlider from '@react-native-community/slider';
import type { SliderProps } from '@react-native-community/slider';

/**
 * Wrapper for @react-native-community/slider to ensure proper prop types
 * Omits ref to avoid type incompatibility issues
 */
export function Slider({ ref: _ref, ...props }: SliderProps): React.ReactElement {
  return (
    <RNSlider
      {...props}
      minimumValue={Number(props.minimumValue)}
      maximumValue={Number(props.maximumValue)}
      value={Number(props.value)}
      step={Number(props.step)}
    />
  );
}
