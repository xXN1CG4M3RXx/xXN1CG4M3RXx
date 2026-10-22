import { Link } from "react-router";
import { getIconComponent } from "../lib/IconRegistry";
import { sanitizeUrl } from "../lib/sanitize";
import { trackLinkClick } from "../lib/analytics";

const isInternalPath = (url) => /^\/(?!\/)/.test(String(url || ""));

/**
 * Row of social/external links rendered from the profile's link list.
 * `compact` trims the label to icon-only, for the hero and the footer.
 */
export default function SocialBar({ links = [], accentColor, compact = false, className = "" }) {
  const items = (links || []).filter((link) => link && (link.url || link.title));

  if (items.length === 0) return null;

  return (
    <ul className={`flex flex-wrap items-center gap-2.5 ${className}`.trim()}>
      {items.map((link, index) => {
        const Icon = getIconComponent(link.icon);
        const internal = Boolean(link.internal) && isInternalPath(link.url);
        const href = internal ? link.url : sanitizeUrl(link.url);

        const inner = (
          <>
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-sky-aqua-500/50 group-hover:bg-sky-aqua-500/10"
              style={accentColor ? { color: accentColor } : undefined}
            >
              <Icon className="h-4 w-4" />
            </span>
            {!compact && (
              <span className="flex min-w-0 flex-col">
                <span className="truncate font-mono text-[11px] uppercase tracking-[0.14em] text-slate-200">
                  {link.title}
                </span>
                {link.description && (
                  <span className="truncate text-[11px] text-slate-500">{link.description}</span>
                )}
              </span>
            )}
          </>
        );

        const classNames =
          "group flex items-center gap-2.5 rounded-xl transition-transform duration-300 hover:-translate-y-0.5";

        return (
          <li key={link.id ?? index}>
            {internal ? (
              <Link to={href} className={classNames} onClick={() => trackLinkClick(link.id)} title={link.title}>
                {inner}
              </Link>
            ) : (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={classNames}
                onClick={() => trackLinkClick(link.id)}
                title={link.title}
              >
                {inner}
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
}
