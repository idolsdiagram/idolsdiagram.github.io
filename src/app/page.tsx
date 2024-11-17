import dayjs from "dayjs"
import Content from "./Content"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"

// dayjsのタイムゾーン設定
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Tokyo')


export type OnemanJson = {
    range: string
    majorDimension: string
    values: string[][]
}

export type RecentEvent = {
    date: string
    name: string
    title: string
    place: string
    start: string
    url: string
    cp: number
}

export const metadata = {
    title: `${process.env.NEXT_PUBLIC_MEATADATA_TITLE}`,
    description: '',
    openGraph: {
        title: `${process.env.NEXT_PUBLIC_MEATADATA_TITLE}`,
        description: `${process.env.NEXT_PUBLIC_MEATADATA_DESCRIPTION}`,
        type: 'website',
        url: `${process.env.SITE_URL}`,
        images: [
            {
                url: `${process.env.NEXT_PUBLIC_MEATADATA_IMAGE_URL}/og.png`,
                type: 'image/png',
                alt: `${process.env.NEXT_PUBLIC_MEATADATA_TITLE}`,
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: `${process.env.NEXT_PUBLIC_MEATADATA_TITLE}`,
        description: `${process.env.NEXT_PUBLIC_MEATADATA_DESCRIPTION}`,
        images: [
            {
                url: `${process.env.NEXT_PUBLIC_MEATADATA_IMAGE_URL}/twitter.png`,
                type: 'image/png',
                alt: `${process.env.NEXT_PUBLIC_MEATADATA_TITLE}`,
            },
        ],
    },
}

/**
 * ページコンポーネント
 */
export default async function Page() {
    // フォームからの入力を取得
    const onemanJson: OnemanJson = process.env.ONEMAN_JSON_URL ? await (await fetch(process.env.ONEMAN_JSON_URL, { next: { revalidate: 10 } })).json() : undefined
    // 手入力分を取得
    const onemanJson2: OnemanJson = process.env.ONEMAN_JSON_URL2 ? await (await fetch(process.env.ONEMAN_JSON_URL2, { next: { revalidate: 10 } })).json() : undefined
    if (!onemanJson) {
        return <></>
    }
    // 手入力分を追加
    if (onemanJson2?.values) {
        onemanJson.values = onemanJson.values.concat(onemanJson2.values)
    }
    const recentEvents = onemanJson.values.slice(1).filter((value) => {
        return value[7] === 'OK'
    }).filter((value) => {
        // 30日以内
        const days = dayjs(value[4]).diff(dayjs().format('YYYY-MM-DD'), 'day')
        return days >= 0 && days <= 30
    }).sort((a, b) => {
        // 日付昇順
        return dayjs(`${a[4]} ${a[5]}`).diff(dayjs(`${b[4]} ${b[5]}`))
    }).map((value) => {
        return {
            name: value[1],
            title: value[2],
            place: value[3],
            date: dayjs(value[4]).format('YYYY年M月D日'),
            start: value[5].replace(/:\d+$/, ''),
            url: value[6],
            cp: value[8] ? Number.parseInt(value[8], 10) : 0,
        }
    })

    return (
        <>
            <Content recentEvents={recentEvents} />
        </>
    )
}
