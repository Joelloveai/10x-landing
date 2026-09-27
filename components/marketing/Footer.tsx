import Link from "next/link";
import { salesMailto, siteConfig } from "@/lib/site-config";
import { Logo } from "@/components/ui/Logo";
import { TrackedAnchor } from "@/components/ui/TrackedAnchor";

const PHONE = "+60 12-372 8392";

/** Public business details only: company, registration, sales email and the company phone line. */
export function Footer() {
  const { company, contact } = siteConfig;
  return (
    <footer className="border-t border-border pb-28 pt-14 md:pb-14">
      <div className="container-x flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <Logo className="text-[22px]" />
        <nav aria-label="Legal" className="flex flex-col gap-2 text-[14px] text-secondary md:items-end">
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
      <div className="container-x mt-12 space-y-2 text-[13px] text-secondary">
        <p>
          © {siteConfig.copyrightYear} {company.name}
        </p>
        {/* Company block: always the last line of the page. */}
        <p className="flex flex-wrap gap-x-2 gap-y-1">
          <span>10X is a product of {company.name}</span>
          <span aria-hidden>/</span>
          <span>Reg {company.registration}</span>
          <span aria-hidden>/</span>
          <TrackedAnchor href={salesMailto} event="email_clicked" eventProps={{ location: "footer" }} className="hover:text-fg">
            {contact.email}
          </TrackedAnchor>
          <span aria-hidden>/</span>
          <a href={`tel:${PHONE.replace(/[^+\d]/g, "")}`} className="hover:text-fg">
            {PHONE}
          </a>
        </p>
      </div>
    </footer>
  );
}
