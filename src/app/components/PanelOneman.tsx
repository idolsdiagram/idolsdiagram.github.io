import { useMemo, useState } from "react"
import type { RecentEvent } from "../page"
import Event from './Event'

/**
 * ワンマン・単独公演パネルコンポーネント
 * @param param0.events イベント情報
 * @param param0.search 検索文字列
 */
export function PanelOneman({ events, search }: { events: RecentEvent[], search: string }) {
    const [filteredEvents, setFilteredEvents] = useState([] as RecentEvent[])

    useMemo(() => {
        setFilteredEvents(events.filter((event) => {
            return event.name.toLowerCase().includes(search)
        }))
    }, [events, search])

    return (
        <>
            <div className="pt-1">近日開催予定のイベント</div>
            {filteredEvents.map((event, index, arr) => {
                return (
                    <>
                        {/* biome-ignore lint/correctness/useJsxKeyInIterable: <explanation> */}
                        <Event event={event} index={index} events={arr} />
                    </>
                )
            })}
        </>
    )
}
