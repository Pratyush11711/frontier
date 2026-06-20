import { siteConfig, footer } from "@/lib/content";
import { CTAButton } from "./CTAButton";
import { Logo } from "./Logo";

const socialLinks = [
  { label: "LinkedIn", href: "#" },
  { label: "X", href: "#" },
  { label: "Instagram", href: "#" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "RUO Policy", href: "#" },
];

export function Footer() {
  return (
    <footer
      id="footer"
      data-nav-theme="dark"
      className="relative z-10 scroll-mt-28 bg-deep-teal pb-[max(1rem,env(safe-area-inset-bottom))]"
    >
      <div className="section-container section-y">
        <div className="grid gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4 lg:gap-10">
          <div>
            <Logo size="md" variant="on-dark" />
            <p className="type-body-l mt-3 max-w-xs text-white/70">{siteConfig.tagline}</p>
            <div className="mt-4">
              <CTAButton variant="coral" className="w-full sm:w-auto">
                {footer.cta}
              </CTAButton>
            </div>
          </div>

          <div>
            <h3 className="type-h4 text-white/60">Platform</h3>
            <ul className="mt-3 space-y-2.5">
              {footer.platform.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="type-body-l text-white/70 transition-colors hover:text-white"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="type-h4 text-white/60">Company</h3>
            <ul className="mt-3 space-y-2.5">
              {footer.company.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="type-body-l text-white/70 transition-colors hover:text-white"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="type-h4 text-white/60">Contact</h3>
            <ul className="type-body-l mt-3 space-y-2.5 text-white/70">
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="break-all transition-colors hover:text-white sm:break-normal"
                >
                  {siteConfig.email}
                </a>
              </li>
              <li>{siteConfig.company}</li>
              <li>{siteConfig.address}</li>
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  aria-label={link.label}
                  className="type-body-s inline-flex min-h-9 items-center rounded-full border border-white/20 px-3 py-1.5 text-white/70 transition-colors hover:border-coral-blush hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-legal mt-8 border-t border-white/10 pt-6 sm:mt-10">
          <p className="type-body-s text-white/80">
            &copy; 2026 {siteConfig.company}. All rights reserved. &middot;{" "}
            {legalLinks.map((link, index) => (
              <span key={link.label}>
                <a href={link.href} className="text-white/80 transition-colors hover:text-white">
                  {link.label}
                </a>
                {index < legalLinks.length - 1 ? " · " : ""}
              </span>
            ))}
          </p>
          <p className="type-mono-compliance mt-4 text-white/75">{footer.disclaimer}</p>
        </div>
      </div>
    </footer>
  );
}
