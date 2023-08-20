import { IndexJson } from "@/app/components/PanelGroupSearch"
import { Content } from "./Content"
import { OnemanJson } from "@/app/page"
import dayjs from "dayjs"
import { decodeBase64, encodeBase64 } from "@/app/components/Base64"

/**
 * グループページコンポーネント
 * @param param0.params.id グループ名
 */
export default async function Page({ params }: { params: { id: string } }) {
    // フォームからの入力を取得
    const onemanJson: OnemanJson = process.env.ONEMAN_JSON_URL ? await (await fetch(process.env.ONEMAN_JSON_URL, { next: { revalidate: 10 } })).json() : undefined
    // 手入力分を取得
    const onemanJson2: OnemanJson = process.env.ONEMAN_JSON_URL2 ? await (await fetch(process.env.ONEMAN_JSON_URL2, { next: { revalidate: 10 } })).json() : undefined
    if (!onemanJson) {
        return <></>
    }
    // 手入力分を追加
    if (onemanJson2) {
        onemanJson.values = onemanJson.values.concat(onemanJson2.values)
    }
    const events = onemanJson.values.slice(1).filter((value) => {
        return value[7] === 'OK'
    }).filter((value) => {
        return value[1] === decodeBase64(params.id)
    }).sort((a, b) => {
        // 日付昇順
        return dayjs(`${b[4]} ${b[5]}`).diff(dayjs(`${a[4]} ${a[5]}`))
    }).map((value) => {
        return {
            name: value[1],
            title: value[2],
            place: value[3],
            date: dayjs(value[4]).format('YYYY年M月D日'),
            start: value[5].replace(/:\d+$/, ''),
            url: value[6],
            cp: value[8] ? parseInt(value[8], 10) : 0,
        }
    })
    return (
        <>
            <Content params={params} events={events} />
        </>
    )
}

/**
 * パスを生成する
 * @returns パスの配列
 */
export async function generateStaticParams() {
    const indexJson: IndexJson = process.env.NEXT_PUBLIC_INDEX_JSON_URL ? await (await fetch(process.env.NEXT_PUBLIC_INDEX_JSON_URL, { next: { revalidate: 0 } })).json() : undefined
    return Object.keys(indexJson.data).filter((key) => {
        return Array.isArray(indexJson.data[key])
    }).map((key) => {
        return {
            id: encodeBase64(key)
        }
    })
}