import Link from "next/link";
import { salesMailto, siteConfig } from "@/lib/site-config";
import { Logo } from "@/components/ui/Logo";
import { TrackedAnchor } from "@/components/ui/TrackedAnchor";

/** Public business details only. Never add personal or founder contact information. */
export function Footer() {
  const { company, contact } = siteConfig;
  return (
    <footer className="border-t border-border pb-28 pt-14 md:pb-14">
      <div className="container-x flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2 text-[14px] text-secondary">
          <Logo className="text-[22px]" />
          <p className="pt-2">A product of {company.name}</p>
          <p>{company.country}</p>
          <p className="pt-2">
            <span className="text-fg">{contact.label}</span>
            <br />
            <TrackedAnchor href={salesMailto} event="email_clicked" eventProps={{ location: "footer" }} className="hover:text-fg">
              {contact.email}
            </TrackedAnchor>
          </p>
        </div>
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
      <div className="container-x mt-12 text-[13px] text-secondary">
        © {siteConfig.copyrightYear} {company.name}
      </div>
    </footer>
  );
}
