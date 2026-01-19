import Link from "next/link";
import { Disc, Instagram, Twitter, Youtube, Mail } from "lucide-react";

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
  { href: "mailto:hello@discdynasty.com", icon: Mail, label: "Email" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Disc className="h-6 w-6" />
              </div>
              <span className="font-[family-name:var(--font-display)] text-xl font-bold">
                Disc Dynasty
              </span>
            </Link>
            <p className="text-sm text-secondary-foreground/80 leading-relaxed">
              Embracing the Spirit of the Game since 2018. Join our community of
              passionate Ultimate Frisbee players.
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
              Team
            </h3>
            <ul className="space-y-2">
              {footerLinks.team.map((link) => (
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
              Resources
            </h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
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
              Get in Touch
            </h3>
            <address className="not-italic text-sm text-secondary-foreground/80 space-y-2">
              <p>City Sports Complex</p>
              <p>123 Athletic Drive</p>
              <p>San Francisco, CA 94102</p>
              <p className="pt-2">
                <a
                  href="mailto:hello@discdynasty.com"
                  className="hover:text-primary transition-colors"
                >
                  hello@discdynasty.com
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-secondary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-secondary-foreground/60">
            &copy; {new Date().getFullYear()} Disc Dynasty. All rights reserved.
          </p>
          <p className="text-sm text-secondary-foreground/60">
            Play hard. Play fair. Play with spirit.
          </p>
        </div>
      </div>
    </footer>
  );
}
