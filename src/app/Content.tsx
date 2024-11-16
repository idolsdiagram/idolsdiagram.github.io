'use client'

import { Nav } from "./components/Nav"
import { Ad, AdJson } from "./components/Ad"
import { IndexJson, PanelGroupSearch } from "./components/PanelGroupSearch"
import { MembersJson, PanelMemberSearch } from "./components/PanelMemberSearch"
import { Box, Tab } from "@mui/material"
import { TabContext, TabList, TabPanel } from "@mui/lab"
import { useEffect, useState } from "react"
import PersonIcon from '@mui/icons-material/Person'
import GroupsIcon from '@mui/icons-material/Groups'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { RecentEvent } from "./page"
import { PanelOneman } from "./components/PanelOneman"

/**
 * コンテンツコンポーネント
 * @param recentEvents 最近のイベント
 */
export default function Content({ recentEvents }: { recentEvents: RecentEvent[] }) {
    const [tab, setTab] = useState("1")
    const [search, setSearch] = useState("")
    const [indexJson, setIndexJson] = useState({} as IndexJson)
    const [membersJson, setMembersJson] = useState({} as MembersJson)
    const [adJson, setAdJson] = useState([] as AdJson[])

    useEffect(() => {
        (async () => {
            process.env.NEXT_PUBLIC_INDEX_JSON_URL ? setIndexJson(await (await fetch(process.env.NEXT_PUBLIC_INDEX_JSON_URL)).json()) : setIndexJson({} as IndexJson)
            process.env.NEXT_PUBLIC_MEMBER_JSON_URL ? setMembersJson(await (await fetch(process.env.NEXT_PUBLIC_MEMBER_JSON_URL)).json()) : setMembersJson({} as MembersJson)
            process.env.NEXT_PUBLIC_AD_JSON_URL ? setAdJson(await (await fetch(process.env.NEXT_PUBLIC_AD_JSON_URL)).json()) : setAdJson([] as AdJson[])
        })()
    }, [])

    return (
        <>
            <div className="container mx-auto bg-white">
                <Nav setSearch={setSearch} />
                <Ad json={adJson} />
                <Box>
                    <TabContext value={tab}>
                        <Box>
                            <TabList onChange={(e, v) => setTab(v)} scrollButtons="auto" centered>
                                <Tab label="グループ検索" value={"1"} sx={{ px: 1, py: 0 }} icon={<GroupsIcon />} iconPosition="top" />
                                <Tab label="アイドル検索" value={"2"} sx={{ px: 1, py: 0 }} icon={<PersonIcon />} iconPosition="top" />
                                <Tab label="ワンマン・単独公演" value={"0"} sx={{ px: 1, py: 0 }} icon={<CalendarMonthIcon />} iconPosition="top" />
                            </TabList>
                        </Box>
                        <TabPanel value="1" sx={{ px: 2, py: 1 }}>
                            <PanelGroupSearch json={indexJson} search={search.toLowerCase()} />
                        </TabPanel>
                        <TabPanel value="2" sx={{ px: 2, py: 1 }}>
                            <PanelMemberSearch json={membersJson} search={search.toLowerCase()} />
                        </TabPanel>
                        <TabPanel value="0" sx={{ px: 2, py: 1 }}>
                            <PanelOneman events={recentEvents} search={search.toLowerCase()} />
                        </TabPanel>
                    </TabContext>
                </Box>
            </div>
        </>
    )
}
