'use client'

import type { IndexJson } from "@/app/components/PanelGroupSearch"
import { Button, Menu, MenuItem } from "@mui/material"
import { useRef, useState } from "react"
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { encodeBase64 } from "@/app/components/Base64";

/**
 * 関連項目メニューコンポーネント
 * @param param0.json インデックス情報
 * @param param0.name イベント名
 */
export function RelatedMenu({ json, name }: { json: IndexJson, name: string }) {
    const [menuOpen, setMenuOpen] = useState(false)
    const buttonRef = useRef<HTMLButtonElement>(null)

    if (!json || !json.data || !json.data[name] || !Array.isArray(json.data[name])) {
        return <></>
    }

    const related = json.data[name] as string[]
    const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setMenuOpen(true)
    }
    const handleClose = () => {
        setMenuOpen(false)
    }
    const locationRedirect = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        const target = event.target as HTMLLIElement
        window.location.href = `/g/${encodeBase64(target.innerText.replace(/\r?\n/g, ''))}`
    }
    return (
        <>
            <Button
                endIcon={<KeyboardArrowDownIcon />}
                onClick={handleButtonClick}
                sx={{ mt: 0, px: 0, height: 30 }}
                ref={buttonRef}
            ><span>関連項目</span></Button>
            <Menu
                anchorEl={buttonRef.current}
                open={menuOpen}
                onClose={handleClose}
                sx={{ py: 0 }}
            >
                {related.map((item, index) => {
                    return (
                        <MenuItem
                            onClick={(event) => locationRedirect(event)}
                            sx={{ typography: 'caption', px: 1, py: 0, minHeight: 30 }}
                            key={item}>{item}</MenuItem>
                    )
                })}
            </Menu>
        </>
    )
}
