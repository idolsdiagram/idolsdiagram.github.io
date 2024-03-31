'use client'

import EditNoteIcon from '@mui/icons-material/EditNote';
import SearchIcon from '@mui/icons-material/Search';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Button, Modal, Tab, TextField, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
dayjs.extend(require('dayjs/plugin/customParseFormat'))

/**
 * ナビゲーションコンポーネント
 * @param param0.setSearch 検索ワードをセットする関数
 * @param param0.name グループ名
 */
export function Nav({ setSearch, name }: { setSearch: ((search: string) => void) | undefined, name?: string }) {

    const [open, setOpen] = useState(false)
    const [onemanGroupName, setOnemanGroupName] = useState("")
    const [onemanTitle, setOnemanTitle] = useState("")
    const [onemanVenue, setOnemanVenue] = useState("")
    const [onemanDate, setOnemanDate] = useState("")
    const [onemanTime, setOnemanTime] = useState("")
    const [onemanUrl, setOnemanUrl] = useState("")
    const [diagramGroupName, setDiagramGroupName] = useState("")
    const [diagramContent, setDiagramContent] = useState("")
    const [diagramUrl, setDiagramUrl] = useState("")
    const [pageUrl, setPageUrl] = useState("")
    const searchRef = useRef<HTMLInputElement>(null)

    const openModal = () => {
        setOpen(true)
    }

    useEffect(() => {
        name !== undefined ? setOnemanGroupName(name) : setOnemanGroupName("")
        name !== undefined ? setDiagramGroupName(name) : setDiagramGroupName("")
    }, [name])

    useEffect(() => {
        setPageUrl(window.location.href)
        window.addEventListener('keydown', (e) => {
            if (e.key === '/') {
                if (searchRef.current?.id !== document.activeElement?.id) {
                    e.preventDefault()
                }
                searchRef.current?.focus()
            }
        })
    }, [])

    // ブラウザバック時の検索ワード復元
    if (searchRef.current !== null && searchRef.current?.value !== '' && setSearch !== undefined) {
        setSearch(searchRef.current.value)
    }

    // 検索フォームが無い場合
    if (setSearch === undefined) {
        return (
            <>
                <div className="flex items-center flex-row box-decoration-clone bg-gradient-to-r from-pink-600 to-pink-500 h-14 p-2">
                    <div className="flex-none pr-2 text-center text-white font-bold leading-none"><a href="/">IDOLS<br />DIAGRAM</a></div>
                    <div className="grow relative"></div>
                    <div className="flex-none pl-2">
                        <Button onClick={openModal} sx={{ p: 0, minWidth: 24 }}>
                            <EditNoteIcon className="text-white" />
                        </Button>
                        <ReportModal
                            onemanGroupName={onemanGroupName}
                            setOnemanGroupName={setOnemanGroupName}
                            onemanTitle={onemanTitle}
                            setOnemanTitle={setOnemanTitle}
                            onemanVenue={onemanVenue}
                            setOnemanVenue={setOnemanVenue}
                            onemanDate={onemanDate}
                            setOnemanDate={setOnemanDate}
                            onemanTime={onemanTime}
                            setOnemanTime={setOnemanTime}
                            onemanUrl={onemanUrl}
                            setOnemanUrl={setOnemanUrl}
                            diagramGroupName={diagramGroupName}
                            setDiagramGroupName={setDiagramGroupName}
                            diagramContent={diagramContent}
                            setDiagramContent={setDiagramContent}
                            diagramUrl={diagramUrl}
                            setDiagramUrl={setDiagramUrl}
                            pageUrl={pageUrl}
                            open={open}
                            setOpen={setOpen}
                        />
                    </div>
                </div >
            </>
        )
    }

    // 検索フォームがある場合
    return (
        <>
            <div className="flex items-center flex-row box-decoration-clone bg-gradient-to-r from-pink-600 to-pink-500 h-14 p-2">
                <div className="flex-none pr-2 text-center text-white font-bold leading-none">IDOLS<br />DIAGRAM</div>
                <div className="grow relative">
                    <div className="absolute flex inset-y-1 left-2">
                        <SearchIcon className="text-slate-500" />
                    </div>
                    <input type="text" id="search" className="form-input py-1 pl-10 pr-4 rounded w-full" onChange={(e) => setSearch(e.target.value)} placeholder="Search" ref={searchRef} />
                </div>
                <div className="flex-none pl-2">
                    <Button onClick={openModal} sx={{ p: 0, minWidth: 24 }}>
                        <EditNoteIcon className="text-white" />
                    </Button>
                    <ReportModal
                        onemanGroupName={onemanGroupName}
                        setOnemanGroupName={setOnemanGroupName}
                        onemanTitle={onemanTitle}
                        setOnemanTitle={setOnemanTitle}
                        onemanVenue={onemanVenue}
                        setOnemanVenue={setOnemanVenue}
                        onemanDate={onemanDate}
                        setOnemanDate={setOnemanDate}
                        onemanTime={onemanTime}
                        setOnemanTime={setOnemanTime}
                        onemanUrl={onemanUrl}
                        setOnemanUrl={setOnemanUrl}
                        diagramGroupName={diagramGroupName}
                        setDiagramGroupName={setDiagramGroupName}
                        diagramContent={diagramContent}
                        setDiagramContent={setDiagramContent}
                        diagramUrl={diagramUrl}
                        setDiagramUrl={setDiagramUrl}
                        pageUrl={pageUrl}
                        open={open}
                        setOpen={setOpen}
                    />
                </div>
            </div >
        </>
    )
}

// 情報提供フォーム
function ReportModal(
    {
        onemanGroupName,
        setOnemanGroupName,
        onemanTitle,
        setOnemanTitle,
        onemanVenue,
        setOnemanVenue,
        onemanDate,
        setOnemanDate,
        onemanTime,
        setOnemanTime,
        onemanUrl,
        setOnemanUrl,
        diagramGroupName,
        setDiagramGroupName,
        diagramContent,
        setDiagramContent,
        diagramUrl,
        setDiagramUrl,
        pageUrl,
        open,
        setOpen,
    }: {
        onemanGroupName: string,
        setOnemanGroupName: (onemanGroupName: string) => void,
        onemanTitle: string,
        setOnemanTitle: (onemanVenue: string) => void,
        onemanVenue: string,
        setOnemanVenue: (onemanVenue: string) => void,
        onemanDate: string,
        setOnemanDate: (onemanDate: string) => void,
        onemanTime: string,
        setOnemanTime: (onemanTime: string) => void,
        onemanUrl: string,
        setOnemanUrl: (onemanUrl: string) => void,
        diagramGroupName: string,
        setDiagramGroupName: (diagramGroupName: string) => void,
        diagramContent: string,
        setDiagramContent: (diagramContent: string) => void,
        diagramUrl: string,
        setDiagramUrl: (diagramUrl: string) => void,
        pageUrl: string,
        open: boolean,
        setOpen: (open: boolean) => void,
    }) {
    const [tab, setTab] = useState("1")
    const closeModal = () => {
        setOpen(false)
    }
    const modalStyle = {
        position: 'absolute' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '85%',
        bgcolor: 'background.paper',
        border: '0px solid #666699',
        boxShadow: 24,
        px: 1,
        py: 2,
    }

    const onemanDateOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOnemanDate(e.target.value)
        if (e.target.value === '') {
            e.target.style.color = 'transparent'
        } else {
            e.target.style.color = 'black'
        }
    }

    const validateDateTime = (date: string, format: string) => {
        return dayjs(date, format).format(format) === date
    }
    const onemanGroupNameRef = useRef<HTMLInputElement>(null)
    const onemanTitleRef = useRef<HTMLInputElement>(null)
    const onemanVenueRef = useRef<HTMLInputElement>(null)
    const onemanDateRef = useRef<HTMLInputElement>(null)
    const onemanTimeRef = useRef<HTMLInputElement>(null)
    const onemanUrlRef = useRef<HTMLInputElement>(null)
    const [onemanOkMessage, setOnemanOkMessage] = useState('')
    const [onemanErrorMessage, setOnemanErrorMessage] = useState('')
    const [diagramOkMessage, setDiagramOkMessage] = useState('')
    const [diagramErrorMessage, setDiagramErrorMessage] = useState('')
    const sendOneman = () => {
        const errors: string[] = []
        if (onemanGroupNameRef.current) {
            if (onemanGroupName === '') {
                errors.push('グループ名')
                onemanGroupNameRef.current.previousElementSibling?.classList.add('text-red-500')
                onemanGroupNameRef.current.classList.add('border-red-500')
            } else {
                onemanGroupNameRef.current.previousElementSibling?.classList.remove('text-red-500')
                onemanGroupNameRef.current.classList.remove('border-red-500')
            }
        }
        if (onemanTitleRef.current) {
            if (onemanVenue === '') {
                errors.push('イベントタイトル')
                onemanTitleRef.current.previousElementSibling?.classList.add('text-red-500')
                onemanTitleRef.current.classList.add('border-red-500')
            } else {
                onemanTitleRef.current.previousElementSibling?.classList.remove('text-red-500')
                onemanTitleRef.current.classList.remove('border-red-500')
            }
        }
        if (onemanVenueRef.current) {
            if (onemanVenue === '') {
                errors.push('会場')
                onemanVenueRef.current.previousElementSibling?.classList.add('text-red-500')
                onemanVenueRef.current.classList.add('border-red-500')
            } else {
                onemanVenueRef.current.previousElementSibling?.classList.remove('text-red-500')
                onemanVenueRef.current.classList.remove('border-red-500')
            }
        }
        if (onemanDateRef.current) {
            if (onemanDate === '' || validateDateTime(onemanDate, 'YYYY-MM-DD') === false) {
                errors.push('開催日')
                onemanDateRef.current.previousElementSibling?.classList.add('text-red-500')
                onemanDateRef.current.classList.add('border-red-500')
            } else {
                onemanDateRef.current.previousElementSibling?.classList.remove('text-red-500')
                onemanDateRef.current.classList.remove('border-red-500')
            }
        }
        if (onemanTimeRef.current) {
            if (onemanTime !== '' && validateDateTime(onemanTime, 'HH:mm') === false) {
                errors.push('開演時刻')
                onemanTimeRef.current.previousElementSibling?.classList.add('text-red-500')
                onemanTimeRef.current.classList.add('border-red-500')
            } else {
                onemanTimeRef.current.previousElementSibling?.classList.remove('text-red-500')
                onemanTimeRef.current.classList.remove('border-red-500')
            }
        }
        if (onemanUrlRef.current) {
            if (onemanUrl === '') {
                errors.push('参考URL')
                onemanUrlRef.current.previousElementSibling?.classList.add('text-red-500')
                onemanUrlRef.current.classList.add('border-red-500')
            } else {
                onemanUrlRef.current.previousElementSibling?.classList.remove('text-red-500')
                onemanUrlRef.current.classList.remove('border-red-500')
            }
        }

        if (errors.length > 0) {
            setOnemanOkMessage('')
            setOnemanErrorMessage('※' + errors.join('、') + 'を入力してください。')
            return
        } else {
            setOnemanOkMessage('')
            setOnemanErrorMessage('')
            // 送信処理
            const formData = new FormData()
            formData.append('entry.18344830', onemanGroupName) // グループ名
            formData.append('entry.1143312203', onemanTitle) // イベントタイトル
            formData.append('entry.1850468250', onemanVenue) // 会場名
            formData.append('entry.149250323', onemanDate) // 開催日
            formData.append('entry.1280716583', onemanTime) // 開演時刻
            formData.append('entry.1289997855', onemanUrl) // 参考URL
            if (process.env.NEXT_PUBLIC_ONEMAN_FORM === undefined) {
                setOnemanErrorMessage('※送信に失敗しました')
            } else {
                fetch(
                    process.env.NEXT_PUBLIC_ONEMAN_FORM,
                    {
                        method: 'POST',
                        mode: 'no-cors',
                        body: formData,
                    }
                ).then((res) => {
                    setOnemanGroupName('')
                    setOnemanTitle('')
                    setOnemanVenue('')
                    setOnemanDate('')
                    setOnemanTime('')
                    setOnemanUrl('')
                    setOnemanOkMessage('※送信しました')
                }).catch((error) => {
                    setOnemanErrorMessage('※送信に失敗しました')
                })
            }
        }
    }

    const diagramGroupNameRef = useRef<HTMLInputElement>(null)
    const diagramContentRef = useRef<HTMLTextAreaElement>(null)
    const diagramUrlRef = useRef<HTMLInputElement>(null)
    const sendDiagram = () => {
        const errors: string[] = []
        if (diagramGroupNameRef.current) {
            if (diagramGroupName === '') {
                errors.push('グループ名')
                diagramGroupNameRef.current.previousElementSibling?.classList.add('text-red-500')
                diagramGroupNameRef.current.classList.add('border-red-500')
            } else {
                diagramGroupNameRef.current.previousElementSibling?.classList.remove('text-red-500')
                diagramGroupNameRef.current.classList.remove('border-red-500')
            }
        }
        if (diagramContentRef.current) {
            if (diagramContent === '') {
                errors.push('内容')
                diagramContentRef.current.previousElementSibling?.classList.add('text-red-500')
                diagramContentRef.current.classList.add('border-red-500')
            } else {
                diagramContentRef.current.previousElementSibling?.classList.remove('text-red-500')
                diagramContentRef.current.classList.remove('border-red-500')
            }
        }
        if (diagramUrlRef.current) {
            if (diagramUrl !== '' && !diagramUrl.match(/^http(s)?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+$/g)) {
                errors.push('参考URL')
                diagramUrlRef.current.previousElementSibling?.classList.add('text-red-500')
                diagramUrlRef.current.classList.add('border-red-500')
            } else {
                diagramUrlRef.current.previousElementSibling?.classList.remove('text-red-500')
                diagramUrlRef.current.classList.remove('border-red-500')
            }
        }
        if (errors.length > 0) {
            setDiagramOkMessage('')
            const errorMessage = ((errors: string[]) => {
                let result = '※'
                const _errors = errors.filter(v => v != '参考URL')
                if (_errors.length > 0) {
                    result += _errors.join('、') + 'を入力してください。'
                }
                if (errors.includes('参考URL')) {
                    result += '参考URLの形式が正しくありません。'
                }
                return result
            })(errors)
            setDiagramErrorMessage(errorMessage)
            return
        } else {
            setDiagramOkMessage('')
            setDiagramErrorMessage('')
            const formData = new FormData()
            formData.append('entry.1564804804', diagramGroupName) // グループ名
            formData.append('entry.1444084372', diagramContent) // 内容
            formData.append('entry.1227477358', diagramUrl) // 参考URL
            formData.append('entry.1639430889', pageUrl) // ページURL
            if (process.env.NEXT_PUBLIC_DIAGRAM_FORM === undefined) {
                setOnemanErrorMessage('※送信に失敗しました')
            } else {
                fetch(
                    process.env.NEXT_PUBLIC_DIAGRAM_FORM,
                    {
                        method: 'POST',
                        mode: 'no-cors',
                        body: formData,
                    }
                ).then((res) => {
                    setDiagramGroupName('')
                    setDiagramContent('')
                    setDiagramUrl('')
                    setDiagramOkMessage('※送信しました')
                }).catch((error) => {
                    setDiagramErrorMessage('※送信に失敗しました')
                })
            }
        }
    }

    const groupNames: string[] = []

    return (
        <Modal
            open={open}
            onClose={closeModal}
        >
            <Box sx={modalStyle}>
                <TabContext value={tab}>
                    <Box>
                        <TabList onChange={(e, v) => setTab(v)} scrollButtons="auto" centered>
                            <Tab label="相関図" value={"1"} />
                            <Tab label="ワンマン・単独公演" value={"0"} />
                        </TabList>
                    </Box>
                    <TabPanel value="0" sx={{ px: 2, py: 1 }}>
                        <Typography variant='subtitle1'>ワンマン・単独公演情報</Typography>
                        <Typography variant='caption'></Typography>
                        <div className='text-green-500 text-xs'>{onemanOkMessage}</div>
                        <div className='text-red-500 text-xs'>{onemanErrorMessage}</div>
                        {/* <Autocomplete
                            options={groupNames}
                            renderInput={(params) => <TextField {...params} label="グループ名" />}
                        /> */}
                        <div>
                            <p className="text-gray-500 text-xs pt-2 pb-1">グループ名*</p>
                            <input
                                type="text"
                                className="border border-gray-300 rounded px-2 py-3 w-full"
                                value={onemanGroupName}
                                onChange={(e) => setOnemanGroupName(e.target.value)}
                                ref={onemanGroupNameRef}
                            />
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs pt-2 pb-1">イベントタイトル*</p>
                            <input
                                type="text"
                                className="border border-gray-300 rounded px-2 py-3 w-full"
                                value={onemanTitle}
                                onChange={(e) => setOnemanTitle(e.target.value)}
                                ref={onemanTitleRef}
                            />
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs pt-2 pb-1">会場*</p>
                            <input
                                type="text"
                                className="border border-gray-300 rounded px-2 py-3 w-full"
                                value={onemanVenue}
                                onChange={(e) => setOnemanVenue(e.target.value)}
                                ref={onemanVenueRef}
                            />
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs pt-2 pb-1">開催日*</p>
                            <input
                                type="date"
                                className="border border-gray-300 rounded px-2 py-3 w-full"
                                value={onemanDate}
                                onChange={(e) => setOnemanDate(e.target.value)}
                                ref={onemanDateRef}
                            />
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs pt-2 pb-1">開演時刻</p>
                            <input
                                type="time"
                                className="border border-gray-300 rounded px-2 py-3 w-full"
                                value={onemanTime}
                                onChange={(e) => setOnemanTime(e.target.value)}
                                ref={onemanTimeRef}
                            />
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs pt-2 pb-1">参考URL*</p>
                            <input
                                type="text"
                                className="border border-gray-300 rounded px-2 py-3 w-full"
                                value={onemanUrl}
                                onChange={(e) => setOnemanUrl(e.target.value)}
                                ref={onemanUrlRef}
                            />
                        </div>
                        <input type="hidden" value={pageUrl} />
                        <div className='flex flex-row'>
                            <div className='flex-auto'>
                                <Button variant="text" sx={{ mt: 2 }} onClick={closeModal}>閉じる</Button>
                            </div>
                            <div className='flex-auto text-right'>
                                <Button variant="contained" sx={{ mt: 2 }} style={{ backgroundColor: '#1976d2' }} onClick={sendOneman}>送信</Button>
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel value="1" sx={{ px: 2, py: 1 }}>
                        <Typography variant='subtitle1'>記載されている情報について</Typography>
                        <Typography variant='caption'>随時修正依頼を受け付けております。</Typography>
                        <div className='text-green-500 text-xs'>{diagramOkMessage}</div>
                        <div className='text-red-500 text-xs'>{diagramErrorMessage}</div>
                        <div>
                            <p className="text-gray-500 text-xs pt-2 pb-1">グループ名*</p>
                            <input
                                type="text"
                                className="border border-gray-300 rounded px-2 py-3 w-full"
                                value={diagramGroupName}
                                onChange={(e) => setDiagramGroupName(e.target.value)}
                                ref={diagramGroupNameRef}
                            />
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs pt-2 pb-1">内容*</p>
                            <textarea
                                className="border border-gray-300 rounded px-2 py-3 w-full"
                                rows={4}
                                value={diagramContent}
                                onChange={(e) => setDiagramContent(e.target.value)}
                                ref={diagramContentRef}
                            />
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs pt-2 pb-1">参考URL</p>
                            <input
                                type="text"
                                className="border border-gray-300 rounded px-2 py-3 w-full"
                                value={diagramUrl}
                                onChange={(e) => setDiagramUrl(e.target.value)}
                                ref={diagramUrlRef}
                            />
                        </div>
                        <input type="hidden" value={pageUrl} />
                        <div className='flex flex-row'>
                            <div className='flex-auto'>
                                <Button variant="text" sx={{ mt: 2 }} onClick={closeModal}>閉じる</Button>
                            </div>
                            <div className='flex-auto text-right'>
                                <Button variant="contained" sx={{ mt: 2 }} style={{ backgroundColor: '#1976d2' }} onClick={sendDiagram}>送信</Button>
                            </div>
                        </div>
                    </TabPanel>
                </TabContext>
            </Box>
        </Modal >
    )
}