import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { Logo } from "@/components/ui/Logo";
import { TrackedAnchor } from "@/components/ui/TrackedAnchor";

export function Footer() {
  const { company, contact } = siteConfig;
  return (
    <footer className="border-t border-border pb-28 pt-14 md:pb-14">
      <div className="container-x flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2 text-[14px] text-secondary">
          <Logo className="text-[24px]" />
          <p>A product of {company.name}</p>
          <p>
            Registration: <span className="font-mono">{company.registration}</span>
          </p>
          <p>
            <TrackedAnchor href={`mailto:${contact.email}`} event="email_clicked" eventProps={{ location: "footer" }} className="hover:text-fg">
              {contact.email}
            </TrackedAnchor>
          </p>
          <p>
            <TrackedAnchor href={`tel:${contact.phoneE164}`} event="phone_clicked" eventProps={{ location: "footer" }} className="hover:text-fg">
              {contact.phoneDisplay}
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
        © {siteConfig.copyrightYear} {company.shortName}
      </div>
    </footer>
  );
}
