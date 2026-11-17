// ---------------------------------------------------------------------------
// motion: entrance animations without an animation library
// ---------------------------------------------------------------------------
// The site used framer-motion for one thing: fading or sliding an element in
// when it appears (`initial` → `animate`), about 200 times. That cost every
// page 37 kB of compressed JavaScript and a share of hydration time on phones.
// This module keeps the same JSX (`<motion.div initial={…} animate={…}>`) and
// renders a plain element with a CSS animation instead, so components did not
// have to change and the browser does the work without JavaScript.
//
// What it supports, which is everything the site used:
// - `initial` as the state to animate from: opacity, x, y, scale (and width, for
//   bars). `initial={false}` or no `initial` means no entrance animation.
// - `animate` (or `whileInView`) as the resting state. Values other than the
//   defaults are applied as inline style, with a CSS transition, so a bar whose
//   width follows state still moves.
// - `transition.duration` and `transition.delay`, in seconds.
// - `variants` with string states.
// Not supported, and ignored without error: `exit` (elements leave at once),
// `whileHover`, `whileTap`, `layout`, springs. `AnimatePresence` renders its
// children as they are.
//
// The keyframes are in globals.css (`motion-lite-in`, `motion-lite-grow`), with
// a prefers-reduced-motion rule that switches them off. Because the animation is
// CSS, server-rendered content is visible before hydration; framer-motion left
// it at opacity 0 until its JavaScript ran.
//
// No 'use client': the module has no hooks or handlers, so server components can
// use it too. `bundle-boundaries.test.ts` fails if framer-motion is imported again.

import { createElement, forwardRef, type ComponentPropsWithoutRef, type CSSProperties, type ElementType, type ForwardRefExoticComponent, type ReactNode, type RefAttributes } from 'react';

export interface MotionValues {
  opacity?: number;
  x?: number | string;
  y?: number | string;
  scale?: number;
  rotate?: number;
  width?: number | string;
  height?: number | string;
  left?: number | string;
  [property: string]: unknown;
}

/** A named set of states, as framer-motion's `Variants` */
export type Variants = Record<string, MotionValues>;

type Target = MotionValues | string | boolean;

export interface MotionProps {
  /** The state to animate from on mount; `false` or absent means no entrance animation */
  initial?: Target;
  /** The resting state */
  animate?: Target;
  /** Accepted for compatibility; elements leave without an animation */
  exit?: Target;
  transition?: { duration?: number; delay?: number; [option: string]: unknown };
  whileInView?: Target;
  whileHover?: unknown;
  whileTap?: unknown;
  viewport?: unknown;
  variants?: Variants;
}

const px = (value: number | string) => (typeof value === 'number' ? `${value}px` : value);
const SIZE_KEYS = ['width', 'height', 'left'] as const;

function resolve(target: Target | undefined, variants: Variants | undefined): MotionValues | undefined {
  if (target === undefined || typeof target === 'boolean') return undefined;
  return typeof target === 'string' ? variants?.[target] : target;
}

/** Inline style for the resting state: only what differs from an element's defaults */
function restingStyle(to: MotionValues | undefined): CSSProperties {
  const style: CSSProperties = {};
  if (!to) return style;
  const transform: string[] = [];
  const x = to.x ?? 0;
  const y = to.y ?? 0;
  if (x !== 0 || y !== 0) transform.push(`translate(${px(x)}, ${px(y)})`);
  if (to.scale !== undefined && to.scale !== 1) transform.push(`scale(${to.scale})`);
  if (to.rotate) transform.push(`rotate(${to.rotate}deg)`);
  if (transform.length) style.transform = transform.join(' ');
  if (to.opacity !== undefined && to.opacity !== 1) style.opacity = to.opacity;
  for (const key of SIZE_KEYS) {
    const value = to[key];
    if ((typeof value === 'number' || typeof value === 'string') && value !== 'auto') style[key] = px(value);
  }
  return style;
}

type MotionComponent<Tag extends ElementType> = ForwardRefExoticComponent<
  Omit<ComponentPropsWithoutRef<Tag>, keyof MotionProps> & MotionProps & RefAttributes<Element>
>;

function create<Tag extends ElementType>(tag: Tag): MotionComponent<Tag> {
  const Component = forwardRef<Element, MotionProps & { className?: string; style?: CSSProperties; children?: ReactNode }>(function Motion(
    { initial, animate, exit: _exit, transition, whileInView, whileHover: _hover, whileTap: _tap, viewport: _viewport, variants, className, style, ...rest },
    ref,
  ) {
    const from = initial === false ? undefined : resolve(initial, variants);
    const to = resolve(animate ?? whileInView, variants);
    const resting = restingStyle(to);
    const vars: Record<string, string | number> = {};
    const classes: string[] = [];

    if (from && (from.opacity !== undefined || from.x !== undefined || from.y !== undefined || from.scale !== undefined)) {
      classes.push('motion-lite');
      if (from.opacity !== undefined) vars['--ml-o'] = from.opacity;
      if (from.x !== undefined) vars['--ml-x'] = px(from.x);
      if (from.y !== undefined) vars['--ml-y'] = px(from.y);
      if (from.scale !== undefined) vars['--ml-s'] = from.scale;
    }
    // a bar that grows from one width to another
    if (from && (typeof from.width === 'number' || typeof from.width === 'string') && resting.width !== undefined) {
      classes.push('motion-lite-grow');
      vars['--ml-w'] = px(from.width);
    }
    if (classes.length) {
      if (typeof transition?.duration === 'number') vars['--ml-d'] = `${transition.duration}s`;
      if (typeof transition?.delay === 'number' && transition.delay > 0) vars['--ml-delay'] = `${transition.delay}s`;
    }
    // a resting state that follows props (a width, a position) moves instead of jumping
    const follows = Object.keys(resting);
    const followStyle: CSSProperties = follows.length
      ? { transitionProperty: follows.join(', '), transitionDuration: `${typeof transition?.duration === 'number' ? transition.duration : 0.4}s`, transitionTimingFunction: 'ease-out' }
      : {};

    return createElement(tag as ElementType, {
      ...rest,
      ref,
      className: [className, ...classes].filter(Boolean).join(' ') || undefined,
      style: { ...followStyle, ...resting, ...vars, ...style },
    });
  });
  Component.displayName = `motion.${String(tag)}`;
  return Component as unknown as MotionComponent<Tag>;
}

export const motion = {
  div: create('div'),
  span: create('span'),
  p: create('p'),
  h1: create('h1'),
  h2: create('h2'),
  h3: create('h3'),
  section: create('section'),
  nav: create('nav'),
  ul: create('ul'),
  li: create('li'),
  tr: create('tr'),
  button: create('button'),
  a: create('a'),
};

/** Kept so existing JSX compiles; children render as they are and leave without an exit animation */
export function AnimatePresence({ children }: { children?: ReactNode; mode?: string; initial?: boolean }) {
  return <>{children}</>;
}
