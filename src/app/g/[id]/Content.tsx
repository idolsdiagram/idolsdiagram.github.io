'use client'

import { Ad, type AdJson } from "@/app/components/Ad"
import { Nav } from "@/app/components/Nav"
import { EventLabels, type IndexJson } from "@/app/components/PanelGroupSearch"
import { TabContext, TabList, TabPanel } from "@mui/lab"
import { Box, Grid, Stack, Switch, Tab, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SocialDistanceIcon from '@mui/icons-material/SocialDistance';
import { RelatedMenu } from "./RelatedMenu"
import { PanelOneman } from "./components/PanelOneman"
import type { RecentEvent } from "@/app/page"
import { decodeBase64 } from "../../components/Base64"

/**
 * グループページコンテンツコンポーネント
 * @param param0.params.id グループ名
 */
export function Content({ params, events }: { params: { id: string }, events: RecentEvent[] }) {
    const [tab, setTab] = useState("1")
    const [indexJson, setIndexJson] = useState({} as IndexJson)
    const [adJson, setAdJson] = useState([] as AdJson[])
    const [simple, setSimple] = useState(true)

    useEffect(() => {
        (async () => {
            process.env.NEXT_PUBLIC_INDEX_JSON_URL ? setIndexJson(await (await fetch(process.env.NEXT_PUBLIC_INDEX_JSON_URL)).json()) : setIndexJson({} as IndexJson)
            process.env.NEXT_PUBLIC_AD_JSON_URL ? setAdJson(await (await fetch(process.env.NEXT_PUBLIC_AD_JSON_URL)).json()) : setAdJson([] as AdJson[])
        })()
    }, [])
    return (
        <>
            <div className="container mx-auto bg-white">
                <Nav setSearch={undefined} name={decodeBase64(params.id)} />
                <Typography variant="h6" component="div" sx={{ px: 1, pt: 1 }}>{decodeBase64(params.id)}</Typography>
                <EventLabels json={indexJson.event} name={decodeBase64(params.id)} />
                <Ad json={adJson} name={decodeBase64(params.id)} />
                <Box>
                    <TabContext value={tab}>
                        <Box>
                            <TabList onChange={(e, v) => setTab(v)} scrollButtons="auto" centered>
                                <Tab label="相関図" value={"1"} sx={{ pt: 1, pb: 0, minHeight: 42 }} icon={<SocialDistanceIcon />} iconPosition="start" />
                                <Tab label="ワンマン・単独公演" value={"0"} sx={{ pt: 1, pb: 0, minHeight: 42 }} icon={<CalendarMonthIcon />} iconPosition="start" />
                            </TabList>
                        </Box>
                        <TabPanel value="1" sx={{ px: 1, py: 1 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Stack direction="row" spacing={0} alignItems="center">
                                        <Typography variant="caption" sx={{ p: 0 }}>全体表示</Typography>
                                        <Switch defaultChecked onChange={(e, v) => setSimple(v)} />
                                        <Typography variant="caption">省略表示</Typography>
                                    </Stack>
                                </Grid>
                                <Grid item xs={6}>
                                    <div className="h-8 text-right">
                                        <RelatedMenu json={indexJson} name={decodeBase64(params.id)} />
                                    </div>
                                </Grid>
                            </Grid>
                            <div className="flex justify-center">
                                {simple ? <img src={`${process.env.NEXT_PUBLIC_DIAGRAM_SVG_SIMPLE}/${encodeURIComponent(decodeBase64(params.id))}.svg`} className="" alt="diagram" /> : <img src={`${process.env.NEXT_PUBLIC_DIAGRAM_SVG}/${encodeURIComponent(decodeBase64(params.id))}.svg`} className="" alt="diagram" />}
                                {/* {simple ? <img src={`${process.env.NEXT_PUBLIC_DIAGRAM_IMAGE_SIMPLE}/${encodeURIComponent(decodeBase64(params.id))}.png`} className="" alt="diagram" /> : <img src={`${process.env.NEXT_PUBLIC_DIAGRAM_IMAGE}/${encodeURIComponent(decodeBase64(params.id))}.png`} className="" alt="diagram" />} */}
                            </div>
                        </TabPanel>
                        <TabPanel value="0" sx={{ px: 1, py: 1 }}>
                            <PanelOneman id={decodeBase64(params.id)} events={events} />
                        </TabPanel>
                    </TabContext>
                </Box>
            </div>
        </>
    )
}
