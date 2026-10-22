import { useInView } from "../lib/animate";

/**
 * Wraps children in a scroll-triggered reveal.
 *
 * ```jsx
 * <Reveal variant="fade-up" delay={120}>
 *   <Card />
 * </Reveal>
 * ```
 *
 * `as` lets the wrapper be a section/article/li without adding a div.
 */
export default function Reveal({
  children,
  variant = "fade-up",
  delay = 0,
  threshold = 0.15,
  once = true,
  as: Tag = "div",
  className = "",
  style,
  id,
  ...rest
}) {
  const [ref, inView] = useInView({ threshold, once });

  return (
    <Tag
      ref={ref}
      id={id}
      data-variant={variant}
      className={`reveal ${inView ? "is-visible" : ""} ${className}`.trim()}
      style={{ "--reveal-delay": `${delay}ms`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
