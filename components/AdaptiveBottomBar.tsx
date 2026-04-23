'use client';

import StickyBottomBar from './StickyBottomBar';

interface AdaptiveBottomBarProps {
  clientId: string;
}

export default function AdaptiveBottomBar({ clientId }: AdaptiveBottomBarProps) {
  return (
    <>
      {/* Sticky Bottom Bar만 사용 */}
      <StickyBottomBar clientId={clientId} />
    </>
  );
}