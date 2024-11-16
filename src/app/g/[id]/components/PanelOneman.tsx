import type { RecentEvent } from "@/app/page"
import dayjs from "dayjs"
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { Card } from "@mui/material"
import { Bar, BarChart, LabelList, ResponsiveContainer, Tooltip, XAxis } from "recharts"
import Carousel from "react-material-ui-carousel"
import Event from '@/app/g/[id]/components/Event'
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"

dayjs.extend(customParseFormat)

// dayjsのタイムゾーン設定
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Tokyo')

/**
 * ワンマン・単独公演パネルコンポーネント
 */
export function PanelOneman({ id, events }: { id: string, events: RecentEvent[] }) {
    const futureEvents = events.filter((event) => {
        // 今後開催予定
        const days = dayjs(dayjs(event.date, 'YYYY年M月D日').format()).diff(dayjs().format('YYYY-MM-DD'), 'day')
        return days >= 0
    })
    const pastEvents = events.filter((event) => {
        // 過去
        const days = dayjs(dayjs(event.date, 'YYYY年M月D日').format()).diff(dayjs().format('YYYY-MM-DD'), 'day')
        return days < 0
    })

    // 合計CP
    const cp = pastEvents.reduce((sum, element) => {
        return sum + element.cp
    }, 0)

    // 開催数
    const count = pastEvents.length

    // 年別CP
    const data = pastEvents.map((event) => {
        return {
            year: dayjs(event.date, 'YYYY年M月D日').format('YYYY'),
            cp: event.cp
        }
    }).reduce((accum, current) => {
        const index = accum.find((element) => {
            return element.year === current.year
        })
        if (index) {
            index.cp += current.cp
        } else {
            accum.push(current)
        }
        return accum
    }, [] as { year: string, cp: number }[]).sort((a, b) => {
        return a.year > b.year ? 1 : -1
    })

    return (
        <>
            <div className="text-right text-xs text-stone-200 underline decoration-dotted">CP</div>
            <Carousel className="md:hidden" animation="fade" autoPlay={true} swipe={true} navButtonsAlwaysVisible={false} navButtonsAlwaysInvisible={true} indicators={false}>
                <TotalCp events={pastEvents} />
                <MaxCp events={pastEvents} />
                <AverageCp events={pastEvents} />
                <MedianCp events={pastEvents} />
            </Carousel>
            <div className="hidden md:block">
                <div className="grid grid-cols-2 gap-3">
                    <TotalCp events={pastEvents} />
                    <MaxCp events={pastEvents} />
                    <AverageCp events={pastEvents} />
                    <MedianCp events={pastEvents} />
                </div>
            </div>
            {futureEvents.length === 0 && pastEvents.length === 0 ? <div className="pt-1">データがありません</div> : <></>}
            {events.map((event, index, arr) => {
                return (
                    <>
                        {/* biome-ignore lint/correctness/useJsxKeyInIterable: <explanation> */}
                        <Event event={event} index={index} events={arr} />
                    </>
                )
            })}
        </>
    )
}

function TotalCp({ events }: { events: RecentEvent[] }) {
    if (events.length === 0) {
        return <></>
    }

    // 合計CP
    const cp = events.reduce((sum, element) => {
        return sum + element.cp
    }, 0)

    // 年別合計CP
    const data = events.map((event) => {
        return {
            year: dayjs(event.date, 'YYYY年M月D日').format('YYYY'),
            cp: event.cp
        }
    }).reduce((accum, current) => {
        const index = accum.find((element) => {
            return element.year === current.year
        })
        if (index) {
            index.cp += current.cp
        } else {
            accum.push(current)
        }
        return accum
    }, [] as { year: string, cp: number }[]).sort((a, b) => {
        return a.year > b.year ? 1 : -1
    })

    return (
        <>
            <Card className="h-32 grid grid-cols-2 gap-0 content-normal bg-sky-50">
                <div className="flex flex-col justify-center items-center">
                    <div className="text-2xl text-gray-600">Total</div>
                    <div className="text-gray-600">
                        <span className="text-4xl">{cp.toLocaleString()}</span>
                        <span className="text-m"> CP</span>
                    </div>
                </div>
                <div className="flex justify-center items-end">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart width={100} height={100} data={FillYear(data)} margin={{ top: 20, left: 10, right: 10, bottom: 0 }}>
                            <XAxis dataKey="year" fontSize="0.8rem" />
                            <Tooltip formatter={(value) => value.toLocaleString()} />
                            <Bar dataKey="cp" fill="#0EA5E9">
                                <LabelList dataKey="cp" position="top" fill="#0EA5E9" fontSize={LabelFontSize(data.length)} formatter={(value: number) => {
                                    return value.toLocaleString()
                                }} />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </>
    )
}

function LabelFontSize(number: number) {
    if (number > 12) {
        return '0.1rem'
    }
    if (number > 8) {
        return '0.2rem'
    }
    if (number > 6) {
        return '0.3rem'
    }
    if (number > 5) {
        return '0.4rem'
    }
    if (number > 4) {
        return '0.5rem'
    }
    if (number > 3) {
        return '0.6rem'
    }
    if (number > 2) {
        return '0.7rem'
    }
    return '0.8rem'
}

function FillYear(data: { year: string, cp: number }[]) {
    const minYear = Math.min(...data.map(element => Number.parseInt(element.year, 10)))
    const maxYear = Math.max(...data.map(element => Number.parseInt(element.year, 10)))
    for (let year = minYear; year <= maxYear; year++) {
        if (!data.find(element => element.year === year.toString())) {
            data.push({ year: year.toString(), cp: 0 })
        }
    }
    return data.sort((a, b) => {
        return a.year > b.year ? 1 : -1
    })
}

function RoundNumberToLocalString(number: number) {
    if (String(number).length > 9) {
        return `${(Math.floor(number / 100000000) / 10).toLocaleString()}G`
    }
    if (String(number).length > 6) {
        return `${(Math.floor(number / 100000) / 10).toLocaleString()}M`
    }
    return number.toLocaleString()
}

function MaxCp({ events }: { events: RecentEvent[] }) {
    if (events.length === 0) {
        return <></>
    }

    // 最大CP
    const maxCp = events.reduce((max, element) => {
        return max > element.cp ? max : element.cp
    }, 0)

    // 年別最大CP
    const data = events.map((event) => {
        return {
            year: dayjs(event.date, 'YYYY年M月D日').format('YYYY'),
            cp: event.cp
        }
    }).reduce((accum, current) => {
        const index = accum.find((element) => {
            return element.year === current.year
        })
        if (index) {
            index.cp = index.cp > current.cp ? index.cp : current.cp
        } else {
            accum.push(current)
        }
        return accum
    }, [] as { year: string, cp: number }[]).sort((a, b) => {
        return a.year > b.year ? 1 : -1
    })

    return (
        <>
            <Card className="h-32 grid grid-cols-2 gap-0 content-normal bg-rose-50">
                <div className="flex flex-col justify-center items-center">
                    <div className="text-2xl text-gray-600">Max</div>
                    <div className="text-gray-600">
                        <span className="text-4xl">{maxCp.toLocaleString()}</span>
                        <span className="text-m"> CP</span>
                    </div>
                </div>
                <div className="flex justify-center items-end">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart width={100} height={100} data={FillYear(data)} margin={{ top: 20, left: 10, right: 10, bottom: 0 }}>
                            <XAxis dataKey="year" fontSize="0.8rem" />
                            <Tooltip formatter={(value) => value.toLocaleString()} />
                            <Bar dataKey="cp" fill="#F43F5E">
                                <LabelList dataKey="cp" position="top" fill="#F43F5E" fontSize={LabelFontSize(data.length)} formatter={(value: number) => {
                                    return value.toLocaleString()
                                }} />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </>
    )
}

function AverageCp({ events }: { events: RecentEvent[] }) {
    if (events.length === 0) {
        return <></>
    }

    // 平均CP
    const averageCp = events.reduce((sum, element) => {
        return sum + element.cp
    }, 0) / events.length

    // 年別平均CP
    const data = events.map((event) => {
        return {
            year: dayjs(event.date, 'YYYY年M月D日').format('YYYY'),
            cp: event.cp
        }
    }).reduce((accum, current) => {
        const index = accum.find((element) => {
            return element.year === current.year
        })
        if (index) {
            index.cp += current.cp
        } else {
            accum.push(current)
        }
        return accum
    }, [] as { year: string, cp: number }[]).map((element) => {
        return {
            year: element.year,
            cp: Math.floor(element.cp / events.filter((event) => {
                return dayjs(event.date, 'YYYY年M月D日').format('YYYY') === element.year
            }).length)
        }
    }).sort((a, b) => {
        return a.year > b.year ? 1 : -1
    })

    return (
        <>
            <Card className="h-32 grid grid-cols-2 gap-0 content-normal bg-teal-50">
                <div className="flex flex-col justify-center items-center">
                    <div className="text-2xl text-gray-600">Avg.</div>
                    <div className="text-gray-600">
                        <span className="text-4xl">{Math.floor(averageCp).toLocaleString()}</span>
                        <span className="text-m"> CP</span>
                    </div>
                </div>
                <div className="flex justify-center items-end">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart width={100} height={100} data={FillYear(data)} margin={{ top: 20, left: 10, right: 10, bottom: 0 }}>
                            <XAxis dataKey="year" fontSize="0.8rem" />
                            <Tooltip formatter={(value) => value.toLocaleString()} />
                            <Bar dataKey="cp" fill="#14B8A6">
                                <LabelList dataKey="cp" position="top" fill="#14B8A6" fontSize={LabelFontSize(data.length)} formatter={(value: number) => {
                                    return value.toLocaleString()
                                }} />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </>
    )
}

function MedianCp({ events }: { events: RecentEvent[] }) {
    if (events.length === 0) {
        return <></>
    }

    // 中央値CP
    const medianCp = events.sort((a, b) => {
        return a.cp > b.cp ? 1 : -1
    }).reduce((median, element, index, array) => {
        return array.length % 2 === 0 ? Math.floor((array[array.length / 2 - 1].cp + array[array.length / 2].cp) / 2) : array[Math.floor(array.length / 2)].cp
    }, 0)

    // 年別中央値CP
    const data = events.map((event) => {
        return {
            year: dayjs(event.date, 'YYYY年M月D日').format('YYYY'),
            cp: event.cp
        }
    }).reduce((accum, current) => {
        const index = accum.find((element) => {
            return element.year === current.year
        })
        if (index) {
            index.cp.push(current.cp)
        } else {
            accum.push({
                year: current.year,
                cp: [current.cp]
            })
        }
        return accum
    }, [] as { year: string, cp: number[] }[]).map((element) => {
        // 要素が偶数個の中央値
        if (element.cp.length % 2 === 0) {
            const sorted = element.cp.sort((a, b) => {
                return a > b ? 1 : -1
            })
            return {
                year: element.year,
                cp: Math.floor((sorted[element.cp.length / 2] + sorted[element.cp.length / 2 - 1]) / 2)
            }
        }
        return {
            year: element.year,
            cp: element.cp.sort((a, b) => {
                return a > b ? 1 : -1
            })[Math.floor(element.cp.length / 2)]
        }
    }).sort((a, b) => {
        return a.year > b.year ? 1 : -1
    })

    return (
        <>
            <Card className="h-32 grid grid-cols-2 gap-0 content-normal bg-violet-50">
                <div className="flex flex-col justify-center items-center">
                    <div className="text-2xl text-gray-600">Median</div>
                    <div className="text-gray-600">
                        <span className="text-4xl">{medianCp.toLocaleString()}</span>
                        <span className="text-m"> CP</span>
                    </div>
                </div>
                <div className="flex justify-center items-end">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart width={100} height={100} data={FillYear(data)} margin={{ top: 20, left: 10, right: 10, bottom: 0 }}>
                            <XAxis dataKey="year" fontSize="0.8rem" />
                            <Tooltip formatter={(value) => value.toLocaleString()} />
                            <Bar dataKey="cp" fill="#8b5cf6">
                                <LabelList dataKey="cp" position="top" fill="#8b5cf6" fontSize={LabelFontSize(data.length)} formatter={(value: number) => {
                                    return value.toLocaleString()
                                }} />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </>
    )
}