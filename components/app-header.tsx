import Link from "next/link";

const navItems = [
  { href: "/learn", label: "Learn" },
  { href: "/flashcards", label: "Flashcards" },
  { href: "/pricing", label: "Pricing" },
  { href: "/profile", label: "Profile" },
  { href: "/admin", label: "Admin" }
];

export function AppHeader() {
  return (
    <header className="topbar">
      <Link className="brand" href="/" aria-label="Nyra home">
        <span className="brand-mark">N</span>
        <span>
          <strong>Nyra</strong>
          <small>Persian-first German</small>
        </span>
      </Link>

      <nav className="desktop-nav" aria-label="Primary navigation">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="topbar-actions">
        <Link className="ghost-button" href="/admin">
          Admin Preview
        </Link>
        <Link className="primary-button compact" href="/learn/family-basics">
          Start learning
        </Link>
      </div>
    </header>
  );
}
