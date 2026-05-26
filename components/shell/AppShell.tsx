import { TopBar } from "./TopBar";
import { SideNav, type NavSection } from "./SideNav";

interface Props {
  active?: NavSection;
  subject?: string | null;
  crumbs?: { label: string; href?: string }[];
  /** If true, hide the sidebar (e.g. test-playing, login). */
  bare?: boolean;
  children: React.ReactNode;
}

export function AppShell({ active, subject = null, crumbs = [], bare, children }: Props) {
  return (
    <div className="h-screen flex flex-col bg-canvas">
      <TopBar crumbs={crumbs} />
      <div className="flex flex-1 min-h-0">
        {!bare && <SideNav active={active} currentSubjectSlug={subject} />}
        <main className="flex-1 min-w-0 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
