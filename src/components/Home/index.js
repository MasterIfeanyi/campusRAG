import FeedArea from "./FeedArea";
import JoinPromoCard from "./JoinPromoCard";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 px-6 py-8">
      <aside className="hidden md:block w-70 shrink-0 md:sticky md:top-20 md:self-start">
        <JoinPromoCard />
      </aside>

      <FeedArea />
    </div>
  );
}