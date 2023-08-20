import { Button, Menu, MenuItem } from "@mui/material"
import { useEffect, useMemo, useRef, useState } from "react"
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { encodeBase64 } from "./Base64";

export type IndexJson = {
    update: string
    data: {
        [key: string]: string | string[]
    }
    event: {
        [key: string]: {
            style: string
            data: string[],
        }
    }
}

/**
 * グループ検索結果パネルコンポーネント
 * @param param0.json インデックス情報
 * @param param0.search 検索文字列
 */
export function PanelGroupSearch({ json, search }: { json: IndexJson, search: string }) {
    const [keys, setKeys] = useState([] as string[])
    const [message, setMessage] = useState("" as string)
    const [filter, setFilter] = useState("" as string)

    useMemo(() => {
        if (json.data === undefined) {
            return
        }
        setKeys(Object.keys(json.data).filter((key) => {
            if (filter === "") {
                return key.toLowerCase().includes(search)
            } else {
                return key.toLowerCase().includes(search) && json.event[filter] && json.event[filter].data.includes(key)
            }
        }))
    }, [json, search, filter])

    useEffect(() => {
        if (keys.length === 0 && search !== "") {
            setMessage("該当するグループが見つかりませんでした。")
        } else {
            setMessage("")
        }
    }, [keys, search])

    return (
        <>
            <div className="h-8 text-right">
                <FilterMenu json={json.event} filter={filter} setFilter={setFilter} />
            </div>
            {message !== ''
                ? <div className="text-slate-500 text-center pt-2">{message}</div>
                : <></>
            }
            <ul>
                {keys.map((key) => {
                    if (Array.isArray(json.data[key])) {
                        return (
                            <li className="pt-2 text-blue-600 hover:text-blue-800" key={key}>
                                <a href={'/g/' + encodeBase64(key)}>{key}</a>
                                <EventLabels json={json.event} name={key} />
                            </li>
                        )
                    } else {
                        return (
                            <li className="pt-2 text-blue-600 hover:text-blue-800" key={key}>
                                <a href={'/g/' + encodeBase64(json.data[key].toString())} key={key}>{key}</a>
                            </li>
                        )
                    }
                })}
            </ul>
        </>
    )
}

function cssAttributesToObject(style: string) {
    return Object.assign({}, ...(style.split(';').map((style) => {
        const attribute = style.split(':')
        return {
            [attribute[0]]: attribute[1]
        }
    })))
}

function FilterMenu({ json, filter, setFilter }: { json: IndexJson['event'], filter: string, setFilter: (filter: string) => void }) {
    const [menuOpen, setMenuOpen] = useState(false)
    const [buttonStyle, setButtonStyle] = useState({} as React.CSSProperties)
    const buttonRef = useRef<HTMLButtonElement>(null)

    // Menu Open
    const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setMenuOpen(true)
    }

    // Menu Close
    const handleMenuClose = () => {
        setMenuOpen(false)
    }

    const handleMenuSelect = (event: React.MouseEvent<HTMLElement>) => {
        const selected = event.currentTarget.innerText.trim()
        if (selected === 'ALL') {
            setFilter('')
            buttonRef.current?.firstChild?.replaceWith('フィルター')
        } else {
            setFilter(selected)
            buttonRef.current?.firstChild?.replaceWith(event.currentTarget.innerText)
        }
        setMenuOpen(false)
    }

    useEffect(() => {
        if (filter === '' || json === undefined) {
            setButtonStyle({})
            return
        }
        if (json[filter] !== undefined) {
            setButtonStyle(cssAttributesToObject(json[filter].style))
        }
    }, [json, filter])

    if (json === undefined) {
        return (<></>)
    }

    return (
        <>
            <Button
                endIcon={<KeyboardArrowDownIcon />}
                onClick={handleButtonClick}
                style={buttonStyle}
                ref={buttonRef}
                sx={{ mt: 0, px: 2, height: 30 }}
            ><span>フィルター</span></Button>
            <Menu
                id="filter-menu"
                anchorEl={buttonRef.current}
                open={menuOpen}
                onClose={handleMenuClose}
                sx={{ mt: 0, px: 0 }}
            >
                <MenuItem
                    onClick={handleMenuSelect}
                    sx={{ m: 0, px: 2, py: 1, minHeight: 0 }}
                >ALL</MenuItem>
                {Object.keys(json).map((event) => {
                    return (
                        <MenuItem
                            onClick={handleMenuSelect}
                            sx={{ m: 0, px: 2, py: 1, minHeight: 0 }}
                            key={event}
                        >{event}</MenuItem>
                    )
                })}
            </Menu>
        </>
    )
}

/**
 * イベントラベルコンポーネント
 * @param param0.json インデックス情報
 * @param param0.name グループ名
 */
export function EventLabels({ json, name }: { json: IndexJson["event"], name: string }) {
    if (json === undefined || name === undefined) {
        return (<></>)
    }
    return (
        <>
            {Object.keys(json).filter((key) => {
                return json[key].data.includes(name)
            }).map((event) => {
                // ラベルの共通スタイル
                const baseStyle = {
                    'font-size': '.5rem',
                }
                // イベント毎のスタイルをマージ
                const attributes = Object.assign(baseStyle, cssAttributesToObject(json[event].style))
                // イベント名から年度を除去
                const _key = event.replace(/\d{4}/, '').split(' ').splice(0, 2).join(' ')
                return (
                    <span className="rounded-sm px-1 ml-1 mb-1 text-xs whitespace-nowrap align-middle" style={attributes} key={event}>{_key}</span>
                )
            })}
        </>
    )
}