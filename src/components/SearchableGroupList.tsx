import { useState, useEffect, useRef } from "react";
import { Virtuoso } from "react-virtuoso";

export function SearchableGroupList({ items, members, events }: {
    items: { name: string, href: string }[];
    members: { name: string, groupName: string, href: string }[];
    events: {
        [key: string]: {
            label: string;
            style: string;
            data: string[];
        }
    }
}) {
    const [searchInput, setSearchInput] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("searchInput") || "";
        }
        return "";
    });
    const [debouncedSearchInput, setDebouncedSearchInput] = useState("");
    const [listHeight, setListHeight] = useState("100vh");
    const [selectedEvent, setSelectedEvent] = useState<string | null>(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("selectedEvent");
            // 保存された値がeventsに存在するかチェック
            if (saved && events[saved]) {
                return saved;
            }
        }
        return null; // eventsにない場合はAll扱い
    });
    const containerRef1 = useRef<HTMLDivElement>(null);
    const containerRef2 = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchInput(searchInput);
        }, 150); // 150msのデバウンス

        localStorage.setItem("searchInput", searchInput);

        return () => {
            clearTimeout(timer);
        };
    }, [searchInput]);

    useEffect(() => {
        // selectedEventが変更されたらlocalStorageに保存
        if (typeof window !== "undefined") {
            if (selectedEvent) {
                localStorage.setItem("selectedEvent", selectedEvent);
            } else {
                localStorage.removeItem("selectedEvent");
            }
        }
    }, [selectedEvent]);

    useEffect(() => {
        const updateHeight = () => {
            // 表示されている（active class を持つ）タブのrefを使用
            const activeTab = document.querySelector('.page.active');
            const currentRef = activeTab?.id === 'page1' ? containerRef1 : containerRef2;

            if (currentRef.current) {
                const rect = currentRef.current.getBoundingClientRect();

                // ビューポートサイズに応じて下部ナビゲーションの高さを調整
                // viewport='s' (small) の場合は下部ナビがあるので95pxを引く
                // viewport='m'以上の場合は下部ナビがないので0pxを引く
                const isSmallViewport = window.matchMedia('(max-width: 600px)').matches;
                const bottomNavHeight = isSmallViewport ? 95 : 25;

                const availableHeight = window.innerHeight - rect.top - bottomNavHeight;
                // Adsenseなどで高さが圧迫された場合でも操作可能な最小高さを確保
                const minHeight = 300;
                const finalHeight = Math.max(availableHeight, minHeight);
                // console.log({ availableHeight, finalHeight, isSmallViewport, bottomNavHeight });
                setListHeight(`${finalHeight}px`);
            }
        };

        // 初期高さを設定
        updateHeight();

        // リサイズやレイアウト変更を監視
        const resizeObserver = new ResizeObserver(updateHeight);
        const mutationObserver = new MutationObserver(updateHeight);

        if (containerRef1.current) {
            resizeObserver.observe(containerRef1.current);
        }
        if (containerRef2.current) {
            resizeObserver.observe(containerRef2.current);
        }

        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true,
        });

        window.addEventListener("resize", updateHeight);

        return () => {
            resizeObserver.disconnect();
            mutationObserver.disconnect();
            window.removeEventListener("resize", updateHeight);
        };
    }, []);

    const filteredItems = debouncedSearchInput
        ? items.filter((item) => item.name.toLowerCase().includes(debouncedSearchInput.toLowerCase()))
        : items;

    // イベントフィルターを適用
    const eventFilteredItems = selectedEvent && events[selectedEvent]
        ? filteredItems.filter((item) => events[selectedEvent].data.includes(item.name))
        : filteredItems;

    const filteredMembers = debouncedSearchInput
        ? members.filter((member) => member.name.toLowerCase().includes(debouncedSearchInput.toLowerCase()))
        : members;

    return (
        <>
            <div className="no-padding">
                <div className="max field small prefix border fill round no-margin">
                    <i>search</i>
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <a onClick={(e) => setSearchInput("")}><i>close</i></a>
                </div>
            </div>
            <div className="tabs tiny-margin">
                <a data-ui="#page1" className="active"><i>groups</i>グループ検索</a>
                <a data-ui="#page2"><i>person</i>メンバー検索</a>
            </div>
            <div className="page active" id="page1">
                <nav className="tiny-padding">
                    <div className="max right-align">
                        <span></span>
                    </div>
                    <div>
                        <button className="chip no-margin" data-ui="#event-filter-menu">
                            <span>{selectedEvent || 'フィルター'}</span>
                            <i>filter_list</i>
                            <menu className="border left no-wrap" id="event-filter-menu">
                                <li className="padding" onClick={(e) => {
                                    setSelectedEvent(null);
                                    const button = e.currentTarget.closest('button');
                                    if (button) {
                                        button.click();
                                        button.blur();
                                    }
                                }}>All</li>
                                {
                                    Object.entries(events).map(
                                        ([eventKey, eventValue]) => (
                                            <li
                                                key={eventKey}
                                                data-key={eventKey}
                                                data-event={eventValue.label}
                                                data-style={eventValue.style}
                                                onClick={(e) => {
                                                    setSelectedEvent(eventKey);
                                                    const button = e.currentTarget.closest('button');
                                                    if (button) {
                                                        button.click();
                                                        button.blur();
                                                    }
                                                }}
                                            >
                                                {eventKey}
                                            </li>
                                        )
                                    )
                                }
                            </menu>
                        </button>
                    </div>
                </nav>
                <article className="top-margin tiny-margin">
                    <div ref={containerRef1}>
                        <ul className="list" style={{ height: listHeight }}>
                            <Virtuoso
                                style={{ height: "100%" }}
                                data={eventFilteredItems}
                                itemContent={(index, item) => {
                                    return <li className="small-margin" key={index}><a href={`/g/${item.href}`}>{item.name}</a></li>;
                                }}
                            />
                        </ul>
                    </div>
                </article>
            </div>
            <div className="page" id="page2">
                <article className="top-margin small-margin">
                    <div ref={containerRef2}>
                        {debouncedSearchInput ? (
                            <ul className="list" style={{ height: listHeight }}>
                                <Virtuoso
                                    style={{ height: "100%" }}
                                    data={filteredMembers}
                                    itemContent={(index, item) => {
                                        return <li className="tiny-margin" key={index}><a href={item.href}><span className="tiny-margin">{item.name}</span><span className="group-name">({item.groupName})</span></a></li>;
                                    }}
                                />
                            </ul>
                        ) : (
                            <div className="center-align" style={{ padding: "2rem", height: listHeight }}>
                                <p>検索する名前を入力してください</p>
                            </div>
                        )}
                    </div>
                </article>
            </div >
        </>
    );
}
