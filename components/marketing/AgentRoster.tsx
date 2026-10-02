import { agents } from "@/lib/agents";
import { AgentAvatar } from "@/components/ui/AgentAvatar";

/** Four small avatars with names and roles, under the hero CTA. */
export function AgentRoster() {
  return (
    <ul aria-label="Your AI team" className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
      {agents.map((a) => (
        <li key={a.name} className="flex items-center gap-2.5">
          <AgentAvatar agent={a} size="sm" />
          <span className="text-left leading-tight">
            <span className="block text-[14px] font-medium text-fg">{a.name}</span>
            <span className="block text-[12px] text-subtle">{a.role}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
