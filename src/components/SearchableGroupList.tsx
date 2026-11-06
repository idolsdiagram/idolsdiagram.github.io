import { useEffect, useRef, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import { ChevronDown, Filter, Search, UserRound, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  items: { name: string; href: string }[];
  members: { name: string; groupName: string; href: string }[];
  events: Record<string, { label: string; style: string; data: string[] }>;
};

export function SearchableGroupList({ items, members, events }: Props) {
  const [searchInput, setSearchInput] = useState(() => typeof window !== "undefined" ? localStorage.getItem("searchInput") || "" : "");
  const [debouncedSearchInput, setDebouncedSearchInput] = useState("");
  const [listHeight, setListHeight] = useState("100vh");
  const [selectedEvent, setSelectedEvent] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("selectedEvent");
      if (saved && events[saved]) return saved;
    }
    return null;
  });
  const [activeTab, setActiveTab] = useState<"groups" | "members">("groups");
  const [filterOpen, setFilterOpen] = useState(false);
  const containerRef1 = useRef<HTMLDivElement>(null);
  const containerRef2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearchInput(searchInput), 150);
    localStorage.setItem("searchInput", searchInput);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    if (selectedEvent) localStorage.setItem("selectedEvent", selectedEvent);
    else localStorage.removeItem("selectedEvent");
  }, [selectedEvent]);

  useEffect(() => {
    const updateHeight = () => {
      const currentRef = activeTab === "groups" ? containerRef1 : containerRef2;
      if (!currentRef.current) return;
      const rect = currentRef.current.getBoundingClientRect();
      const hasBottomNav = !window.matchMedia("(min-width: 1024px)").matches;
      const bottomNav = document.querySelector<HTMLElement>('nav[aria-label="メインナビゲーション"]');
      const bottomNavHeight = hasBottomNav ? (bottomNav?.getBoundingClientRect().height ?? 57) + 16 : 20;
      setListHeight(`${Math.max(window.innerHeight - rect.top - bottomNavHeight, 300)}px`);
    };
    updateHeight();
    const resizeObserver = new ResizeObserver(updateHeight);
    if (containerRef1.current) resizeObserver.observe(containerRef1.current);
    if (containerRef2.current) resizeObserver.observe(containerRef2.current);
    window.addEventListener("resize", updateHeight);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, [activeTab]);

  const filteredItems = debouncedSearchInput
    ? items.filter((item) => item.name.toLowerCase().includes(debouncedSearchInput.toLowerCase()))
    : items;
  const eventFilteredItems = selectedEvent && events[selectedEvent]
    ? filteredItems.filter((item) => events[selectedEvent].data.includes(item.name))
    : filteredItems;
  const filteredMembers = debouncedSearchInput
    ? members.filter((member) => member.name.toLowerCase().includes(debouncedSearchInput.toLowerCase()))
    : members;

  const tabClass = (active: boolean) => `inline-flex items-center justify-center gap-2 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors sm:px-4 ${active ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`;

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input
          type="text"
          aria-label="グループ・メンバーを検索"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          className="h-11 rounded-lg pl-10 pr-11"
        />
        <Button type="button" variant="ghost" size="icon-sm" aria-label="検索をクリア" onClick={() => setSearchInput("")} className="absolute right-1.5 top-1/2 -translate-y-1/2"><X /></Button>
      </div>

      <div>
        <div className="border-b">
          <div role="tablist" aria-label="検索対象" className="flex">
            <button type="button" role="tab" aria-selected={activeTab === "groups"} className={tabClass(activeTab === "groups")} onClick={() => setActiveTab("groups")}><Users aria-hidden="true" className="size-4" />グループ検索</button>
            <button type="button" role="tab" aria-selected={activeTab === "members"} className={tabClass(activeTab === "members")} onClick={() => setActiveTab("members")}><UserRound aria-hidden="true" className="size-4" />メンバー検索</button>
          </div>
        </div>
        {activeTab === "groups" && <div className="flex justify-end pt-3">
          <div className="relative">
            <Button type="button" variant="outline" size="sm" aria-expanded={filterOpen} onClick={() => setFilterOpen((open) => !open)}>
              <Filter />{selectedEvent || "フィルター"}<ChevronDown />
            </Button>
            {filterOpen && <>
              <button aria-label="フィルターを閉じる" className="fixed inset-0 z-10 cursor-default" onClick={() => setFilterOpen(false)} />
              <div role="menu" className="absolute right-0 z-20 mt-2 max-h-72 min-w-48 overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
                <button type="button" role="menuitem" className="w-full rounded-sm px-3 py-2 text-left text-sm hover:bg-accent" onClick={() => { setSelectedEvent(null); setFilterOpen(false); }}>すべて</button>
                {Object.entries(events).map(([key]) => <button type="button" role="menuitem" key={key} className="w-full rounded-sm px-3 py-2 text-left text-sm hover:bg-accent" onClick={() => { setSelectedEvent(key); setFilterOpen(false); }}>{key}</button>)}
              </div>
            </>}
          </div>
        </div>}
      </div>

      {activeTab === "groups" ? <div ref={containerRef1} className="min-h-0">
        <div className="overflow-hidden rounded-lg border bg-card" style={{ height: listHeight }}>
          <Virtuoso
            style={{ height: "100%" }}
            data={eventFilteredItems}
            itemContent={(_index, item) => <div className="border-b px-4 py-2 last:border-0"><a className="text-sm font-medium hover:underline" href={`/g/${item.href}`}>{item.name}</a></div>}
            components={{ EmptyPlaceholder: () => <p className="p-6 text-center text-sm text-muted-foreground">該当するグループはありません</p> }}
          />
        </div>
      </div> : <div ref={containerRef2} className="min-h-0">
        {debouncedSearchInput ? <div className="overflow-hidden rounded-lg border bg-card" style={{ height: listHeight }}>
          <Virtuoso
            style={{ height: "100%" }}
            data={filteredMembers}
            itemContent={(_index, member) => <div className="border-b px-4 py-2 last:border-0"><a className="flex items-baseline gap-2 text-sm hover:underline" href={member.href}><span className="font-medium">{member.name}</span><span className="text-muted-foreground">{member.groupName}</span></a></div>}
            components={{ EmptyPlaceholder: () => <p className="p-6 text-center text-sm text-muted-foreground">該当するメンバーはありません</p> }}
          />
        </div> : <div className="grid place-items-center rounded-lg border bg-card px-6 text-center text-sm text-muted-foreground" style={{ height: listHeight }}>検索する名前を入力してください</div>}
      </div>}
    </section>
  );
}
