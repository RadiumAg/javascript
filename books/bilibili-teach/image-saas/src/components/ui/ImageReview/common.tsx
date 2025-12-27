import {
  X,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { PreviewProps } from 'rc-image/lib/Preview';
import React from 'react';

export const defaultIcons: PreviewProps['icons'] = {
  rotateLeft: <RotateCcw />,
  rotateRight: <RotateCw />,
  zoomIn: <ZoomIn />,
  zoomOut: <ZoomOut />,
  close: <X />,
  left: <ChevronLeft />,
  right: <ChevronRight />,
  flipX: <FlipHorizontal />,
  flipY: <FlipVertical />,
};
