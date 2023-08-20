import { useMemo, useState } from "react"
import { RecentEvent } from "../page"
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import PlaceIcon from '@mui/icons-material/Place'
import { EventDetail } from "./EventDetail"
import { encodeBase64 } from "./Base64"

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
            {filteredEvents.map((event, index) => {
                return (
                    <div className="shadow-lg box-border border rounded-lg px-3 pt-1 pb-2 mt-3 w-full border-zinc-200 bg-zinc-50" key={index}>
                        <div className="text-base mt-1 text-sm">
                            <span className="whitespace-nowrap text-blue-600 hover:text-blue-800 mt-1 text-right"><a href={'/g/' + encodeBase64(event.name)}>{event.name}</a></span>
                            <span className="whitespace-pre-line">『{event.title}』</span>
                        </div>
                        <div className="mt-1">
                            <div className="text-sm">
                                <span><CalendarMonthIcon className="text-sm" /></span>
                                <span className="ml-1">{event.date}</span>
                                <span className="ml-2"><AccessTimeIcon className="text-sm" /></span>
                                <span className="ml-1">{event.start}開演</span>
                            </div>
                            <div className="text-sm">
                                <span><PlaceIcon className="text-sm" /></span>
                                <span className="ml-1">{event.place}</span>
                            </div>
                            <EventDetail event={event} />
                        </div>
                    </div>
                )
            })}
        </>
    )
}
