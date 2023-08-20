import { useEffect, useMemo, useState } from "react"
import { encodeBase64 } from "./Base64"

export type MembersJson = {
    [key: string]: {
        /** ステータス */
        status?: boolean
        /** 名前 */
        name: string
        /** 期間 */
        period?: string
        /** 識別名 */
        port?: string
        /** タイプ */
        type: string
    }[]
}

/**
 * メンバー検索結果パネルコンポーネント
 * @param param0.json メンバー情報
 * @param param0.search 検索文字列
 */
export function PanelMemberSearch({ json, search }: { json: MembersJson, search: string }) {
    const [keys, setKeys] = useState([] as { name: string, group: string }[])
    const [message, setMessage] = useState("" as string)

    useMemo(() => {
        if (search === "") {
            setKeys([])
            return
        }

        setKeys(Object.entries(json).map(([key, value]) => {
            return value.filter((v) => {
                return v.name.toLowerCase().includes(search)
            }).map((v) => {
                // return `${v.name} (${key})`
                return {
                    name: v.name,
                    group: key
                }
            })
        }).filter((v) => {
            return v.length > 0
        }).flat())
    }, [json, search])

    useEffect(() => {
        if (search === "") {
            setMessage("検索する名前を入力してください。")
        } else if (keys.length === 0) {
            setMessage("該当するメンバーが見つかりませんでした。")
        } else {
            setMessage("")
        }
    }, [search, keys])

    return (
        <>
            {message !== ''
                ? <div className="text-slate-500 text-center pt-2">{message}</div>
                : <></>
            }
            <ul>
                {keys.map((key, index) => {
                    return (
                        <li className="pt-2 text-blue-600 hover:text-blue-800" key={index}>
                            <a href={'/g/' + encodeBase64(key.group)} key={index}>{key.name} ({key.group})</a>
                        </li>
                    )
                })}
            </ul>
        </>
    )
}