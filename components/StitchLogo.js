import React from 'react';
import Svg, { Rect, Path, Circle } from 'react-native-svg';

export default function StitchLogo({ size = 44, style }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" style={style}>
      <Rect width="100" height="100" rx="20" fill="#0f2942" />
      <Path d="M22 74V26L48 54V26H56V74L30 46V74H22Z" fill="#ffffff" />
      <Circle cx="74" cy="32" r="7" fill="#38bdf8" />
      <Path d="M67 48H81V54H67V48ZM67 62H81V68H67V62Z" fill="#93c5fd" />
    </Svg>
  );
}
