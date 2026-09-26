import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export default function NotFound() {
  return (
    <main className="container-x flex min-h-dvh flex-col items-center justify-center text-center">
      <Logo className="text-[28px]" />
      <h1 className="text-display mt-8">This page leaked.</h1>
      <p className="text-lead mt-4 text-secondary">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/" className="mt-8 rounded-full bg-accent px-5 py-3 text-[15px] font-medium text-white hover:bg-accent-hover">
        Back to home
      </Link>
    </main>
  );
}
