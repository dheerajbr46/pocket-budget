import { BottomNav } from './BottomNav.jsx';
import { Header } from './Header.jsx';

export function AppShell({ activePage, children, currentTitle, onNavigate }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#ffffff_0%,#edf6f9_34%,#dbeafe_100%)] px-3 py-4 text-ink sm:px-6 sm:py-8">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-[430px] flex-col overflow-hidden rounded-[34px] border border-white/80 bg-paper shadow-soft sm:min-h-[860px]">
        <Header title={currentTitle} />
        <main className="flex-1 overflow-y-auto px-5 pb-28 pt-2">{children}</main>
        <BottomNav activePage={activePage} onNavigate={onNavigate} />
      </div>
    </div>
  );
}
