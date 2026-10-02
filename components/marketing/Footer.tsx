import Link from "next/link";
import { salesMailto, siteConfig } from "@/lib/site-config";
import { Logo } from "@/components/ui/Logo";
import { TrackedAnchor } from "@/components/ui/TrackedAnchor";

/** Public business details only: company, registration and the sales email. */
export function Footer() {
  const { company, contact } = siteConfig;
  return (
    <footer className="border-t border-border pb-12 pt-12">
      <div className="container-x flex flex-col items-center gap-1.5 text-center text-[13px] text-secondary">
        <Logo className="mb-3 text-[22px]" />
        <p>
          © {siteConfig.copyrightYear} {company.name}
        </p>
        <p>Reg {company.registration}</p>
        <p>
          <TrackedAnchor href={salesMailto} event="email_clicked" eventProps={{ location: "footer" }} className="hover:text-fg">
            {contact.email}
          </TrackedAnchor>
        </p>
        {/* Legal pages are only reachable from here, so they stay as one quiet line. */}
        <nav aria-label="Legal" className="mt-3 flex gap-4 text-[12px] text-subtle">
          <Link href="/privacy" className="hover:text-fg">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-fg">
            Terms
          </Link>
          <Link href="/data-deletion" className="hover:text-fg">
            Data Deletion
          </Link>
        </nav>
      </div>
    </footer>
  );
}
