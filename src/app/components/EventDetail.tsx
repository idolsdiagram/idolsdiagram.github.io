import { RecentEvent } from "../page"
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

/**
 * イベント詳細リンクコンポーネント
 */
export function EventDetail({ event }: { event: RecentEvent }) {
    if (event.url === '') {
        return <></>
    }
    return (
        <div className="text-xs text-blue-600 hover:text-blue-800 mt-1 text-right">
            <a href={event.url} target="_blakc">
                <span>イベント詳細</span>
                <OpenInNewIcon className="text-sm" />
            </a>
        </div>
    )
}
