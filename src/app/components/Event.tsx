import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import PlaceIcon from '@mui/icons-material/Place'
import { EventDetail } from '@/app/components/EventDetail'
import { RecentEvent } from '@/app/page'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { useEffect, useState } from 'react'
import { encodeBase64 } from './Base64'
dayjs.extend(customParseFormat)

/**
 * イベント情報コンポーネント
 */
export default function Event({ event, index, events }: { event: RecentEvent, index: number, events: RecentEvent[] }) {
    const [year, setYear] = useState(0)
    const [bgcolor, setBgcolor] = useState('bg-zinc-50')

    useEffect(() => {
        if (index === 0) {
            setYear(dayjs(event.date, 'YYYY年M月D日').year())
        } else {
            if (dayjs(event.date, 'YYYY年M月D日').year() !== dayjs(events[index - 1].date, 'YYYY年M月D日').year()) {
                setYear(dayjs(event.date, 'YYYY年M月D日').year())
            }
        }
        if (dayjs(dayjs(event.date, 'YYYY年M月D日').format()).diff(dayjs().format('YYYY-MM-DD'), 'day') < 0) {
            setBgcolor('bg-zinc-200')
        }
    }, [event, index, events])

    return (
        <>
            <div className={`shadow-lg box-border border rounded-lg px-3 pt-1 pb-2 mt-3 w-full border-zinc-200 ${bgcolor}`} key={index}>
                <div className="text-sm mt-1">
                    <span className="whitespace-nowrap text-blue-600 hover:text-blue-800 mt-1 text-right"><a href={'/g/' + encodeBase64(event.name)}>{event.name}</a></span>
                    <span className="whitespace-pre-line">『{event.title}』</span>
                </div>
                <div className="mt-1">
                    <div className="text-sm">
                        <span><CalendarMonthIcon style={{ fontSize: '1rem' }} /></span>
                        <span className="ml-1">{event.date}</span>
                        {event.start !== '' ? <><span className="ml-2"><AccessTimeIcon style={{ fontSize: '1rem' }} /></span><span className="ml-1">{event.start}開演</span></> : <></>}
                    </div>
                    <div className="text-sm">
                        <span><PlaceIcon style={{ fontSize: '1rem' }} /></span>
                        <span className="ml-1">{event.place}</span>
                    </div>
                    <EventDetail event={event} />
                </div>
            </div>
        </>
    )
}