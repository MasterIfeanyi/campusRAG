import FeedArea from "./FeedArea";
import JoinPromoCard from "./JoinPromoCard";
import SourcesPanel from "./SourcesPanel";

export default function Home() {
  return (
    <div className="mx-auto grid grid-cols-1 md:grid-cols-[280px_1fr_280px] gap-8 px-6 h-[calc(100vh-5rem)]">
      {/* Left sidebar: independent scroll */}
      <aside className="hidden md:block overflow-y-auto h-full py-8">
        <JoinPromoCard />
      </aside>

      {/* Center: page routing / home feed, independent scroll */}
      <main className="overflow-y-auto h-full py-8">
        <div className="max-w-[600px] mx-auto">
          <FeedArea />
        </div>
      </main>

      {/* Right sidebar: sources for the current answer, independent scroll */}
      <aside className="hidden lg:block overflow-y-auto h-full py-8">
        <SourcesPanel />
      </aside>
    </div>
  );
}