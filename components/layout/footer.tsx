import { Instagram, Mail, Twitter, Youtube } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const footerLinks = {
  team: [
    { href: "/roster", label: "Our Roster" },
    { href: "/events", label: "Events & Schedule" },
    { href: "/news", label: "Latest News" },
    { href: "/gallery", label: "Photo Gallery" },
  ],
  resources: [
    { href: "/rules", label: "Rules of Ultimate" },
    { href: "/rules#spirit", label: "Spirit of the Game" },
    { href: "/contact", label: "Join Our Team" },
    { href: "/contact#faq", label: "FAQ" },
  ],
};

const socialLinks = [
  { href: "https://instagram.com", icon: Instagram, label: "Instagram" },
  { href: "https://twitter.com", icon: Twitter, label: "Twitter" },
  { href: "https://youtube.com", icon: Youtube, label: "YouTube" },
  { href: "mailto:hello@discobolos.team", icon: Mail, label: "Email" },
];

export function Footer({ dict, lang }: { dict: any; lang: string }) {
  const footerLinksData = {
    team: [
      { href: `/${lang}/roster`, label: dict.nav.roster },
      { href: `/${lang}/events`, label: dict.nav.events },
      // { href: `/${lang}/news`, label: dict.nav.news },
      { href: `/${lang}/gallery`, label: dict.nav.gallery },
    ],
    resources: [
      { href: `/${lang}/rules`, label: dict.footer.resources },
      { href: `/${lang}/rules#spirit`, label: dict.nav.rules },
      { href: `/${lang}/contact`, label: dict.nav.join },
      { href: `/${lang}/contact#faq`, label: dict.footer.faq },
    ],
  };

  return (
    <footer className="border-t border-border bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href={`/${lang}`} className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full overflow-hidden">
                <Image
                  src="/images/logo.png"
                  alt="Discobolos Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <span className="font-[family-name:var(--font-display)] text-xl font-bold">
                Discobolos
              </span>
            </Link>
            <p className="text-sm text-secondary-foreground/80 leading-relaxed">
              {dict.footer.description}
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary-foreground/10 hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Team Links */}
          <div>
            <h3 className="font-[family-name:var(--font-display)] font-semibold mb-4">
              {dict.footer.team}
            </h3>
            <ul className="space-y-2">
              {footerLinksData.team.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-[family-name:var(--font-display)] font-semibold mb-4">
              {dict.footer.resources}
            </h3>
            <ul className="space-y-2">
              {footerLinksData.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-[family-name:var(--font-display)] font-semibold mb-4">
              {dict.footer.get_in_touch}
            </h3>
            <address className="not-italic text-sm text-secondary-foreground/80 space-y-2">
              <p>{dict.footer.address.complex}</p>
              <p>{dict.footer.address.street}</p>
              <p>{dict.footer.address.city}</p>
              <p className="pt-2">
                <a
                  href="mailto:bodrumdiscobolos@gmail.com"
                  className="hover:text-primary transition-colors"
                >
                  bodrumdiscobolos@gmail.com
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-secondary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-secondary-foreground/60">
            &copy; {new Date().getFullYear()} Discobolos. {dict.footer.all_rights_reserved}
          </p>
          <p className="text-sm text-secondary-foreground/60">
            {dict.footer.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}
