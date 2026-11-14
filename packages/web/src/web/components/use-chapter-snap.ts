import { useCallback, useEffect, useRef, type RefObject } from 'react';

// Full-opacity chapter poses, not crossfades or halfway-assembled camera states.
export const chapterPoses = [.16, .34, .50, .70, .96];
const idleDelay = 240;

export function useChapterSnap(section: RefObject<HTMLElement | null>, reduced: boolean) {
  const navigate = useRef<(index: number) => void>(() => {});

  useEffect(() => {
    const element = section.current;
    if (!element || reduced) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let frame: number | null = null;
    let held = false;
    let previousY = window.scrollY;
    let direction = 0;

    const bounds = () => ({
      start: element.getBoundingClientRect().top + window.scrollY,
      length: element.offsetHeight - window.innerHeight,
    });
    const clearTimer = () => { clearTimeout(timer); timer = undefined; };
    const cancel = () => {
      clearTimer();
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      element.dataset.snapState = 'scrubbing';
    };
    const settle = (index: number) => {
      cancel();
      const { start, length } = bounds();
      if (length <= 0) return;
      const from = window.scrollY;
      const to = start + length * chapterPoses[index]!;
      element.dataset.snapChapter = String(index);
      if (Math.abs(to - from) < 2) { element.dataset.snapState = 'snapped'; return; }
      element.dataset.snapState = 'settling';
      const began = performance.now();
      const duration = Math.min(720, 380 + Math.abs(to - from) * .35);
      const tick = (now: number) => {
        const t = Math.min(1, (now - began) / duration);
        const eased = t * t * (3 - 2 * t);
        // Explicit instant behavior prevents the page's CSS smooth-scroll from nesting tweens.
        window.scrollTo({ top: from + (to - from) * eased, behavior: 'instant' });
        previousY = window.scrollY;
        if (t < 1) frame = requestAnimationFrame(tick);
        else { frame = null; element.dataset.snapState = 'snapped'; }
      };
      frame = requestAnimationFrame(tick);
    };
    const snapNearest = () => {
      timer = undefined;
      if (held || frame !== null) return;
      const { start, length } = bounds();
      if (length <= 0) return;
      const p = (window.scrollY - start) / length;
      // Entry and exit remain normal page scrolling, including slow scroll gestures.
      if (p < 0 || p > 1 || (direction < 0 && p < chapterPoses[0]!) || (direction > 0 && p > chapterPoses[4]! + .002)) return;
      const nearest = chapterPoses.reduce((best, value, index) => Math.abs(value - p) < Math.abs(chapterPoses[best]! - p) ? index : best, 0);
      settle(nearest);
    };
    const queue = () => {
      clearTimer();
      if (!held && frame === null) timer = setTimeout(snapNearest, idleDelay);
    };
    const onScroll = () => {
      if (frame !== null) return;
      const y = window.scrollY;
      if (Math.abs(y - previousY) > .5) direction = Math.sign(y - previousY);
      previousY = y;
      // Ignore the final native scroll event emitted by our own completed tween.
      if (element.dataset.snapState === 'snapped') {
        const { start, length } = bounds();
        const index = Number(element.dataset.snapChapter);
        if (Math.abs(y - (start + length * chapterPoses[index]!)) < 2) return;
      }
      element.dataset.snapState = 'scrubbing';
      queue();
    };
    const onWheel = () => { cancel(); queue(); };
    const onHold = () => { held = true; cancel(); };
    const onRelease = () => { held = false; queue(); };
    const onKey = (event: KeyboardEvent) => {
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) { cancel(); queue(); }
    };
    const onResize = () => { cancel(); previousY = window.scrollY; };
    navigate.current = settle;
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('pointerdown', onHold, { passive: true });
    window.addEventListener('pointerup', onRelease, { passive: true });
    window.addEventListener('pointercancel', onRelease, { passive: true });
    window.addEventListener('touchstart', onHold, { passive: true });
    window.addEventListener('touchend', onRelease, { passive: true });
    window.addEventListener('touchcancel', onRelease, { passive: true });
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      cancel(); navigate.current = () => {};
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('pointerdown', onHold);
      window.removeEventListener('pointerup', onRelease);
      window.removeEventListener('pointercancel', onRelease);
      window.removeEventListener('touchstart', onHold);
      window.removeEventListener('touchend', onRelease);
      window.removeEventListener('touchcancel', onRelease);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
      delete element.dataset.snapState; delete element.dataset.snapChapter;
    };
  }, [section, reduced]);

  return useCallback((index: number) => navigate.current(index), []);
}