import { useEffect, useMemo, useRef, useState } from "react"

export type AdJson = {
    name: string
    items: AdItem[]
}

type AdItem = {
    url: string
    img: string[]
    video: {
        [key: string]: {
            mov: string
            webm: string
        }
    }
    time: number
}

/**
 * Adコンポーネント
 * @param param0.json AD情報
 * @param param0.name グループ名
 */
export function Ad({ json, name }: { json: AdJson[], name?: string }) {
    const [ads, setAds] = useState([] as AdJson[])
    const [ad, setAd] = useState({} as AdItem)
    const [play, setPlay] = useState(false)

    useMemo(() => {
        if (json.length == 0) {
            return
        }
        setAds(json)
        // nameが指定されている場合はそのグループの広告を表示する
        if (name !== undefined) {
            const adGroup = json.find((ad) => ad.name === name)
            if (adGroup !== undefined) {
                setAd(adGroup.items[Math.floor(Math.random() * adGroup.items.length)])
            }
        } else {
            const adGroup = json[Math.floor(Math.random() * json.length)]
            setAd(adGroup.items[Math.floor(Math.random() * adGroup.items.length)])
        }
        // setAd(json[Math.floor(Math.random() * json.length)])
    }, [json, name])

    // 表示する告がない場合
    if (!ad || !ad.img || !ad.video) {
        return <></>
    }

    return (
        <>
            <Banner ad={ad} play={play} setPlay={setPlay} />
            <Video ad={ad} play={play} />
        </>
    )
}

function Banner({ ad, play, setPlay }: { ad: AdItem, play: boolean, setPlay: (play: boolean) => void }) {
    const [bannerImage, setBannerImage] = useState("")
    useEffect(() => {
        if (!ad || !ad.img) {
            return
        }
        setBannerImage(ad.img[0])
    }, [ad])
    const bannerClick = () => {
        if (play) {
            window.open(ad.url, '_blank')
        } else {
            setPlay(true)
            setTimeout(() => {
                setBannerImage(ad.img[1])
            }, ad.time)
        }
    }
    return (
        <>
            <div className="flex justify-center items-center p-2">
                <img src={bannerImage} className="cursor-pointer" alt="広告" onClick={bannerClick} />
            </div>
        </>
    )
}

function Video({ ad, play }: { ad: AdItem, play: boolean }) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const qtRef = useRef<HTMLSourceElement>(null)
    const webmRef = useRef<HTMLSourceElement>(null)

    useEffect(() => {
        if (!ad || !ad.video) {
            return
        }
        if (window.innerWidth < 640) {
            if (window.navigator.userAgent.toLocaleLowerCase().indexOf('firefox') == -1) {
                qtRef.current?.setAttribute('src', ad.video['4x3'].mov)
            }
            webmRef.current?.setAttribute('src', ad.video['4x3'].webm)
        } else {
            if (window.navigator.userAgent.toLocaleLowerCase().indexOf('firefox') == -1) {
                qtRef.current?.setAttribute('src', ad.video['16x9'].mov)
            }
            webmRef.current?.setAttribute('src', ad.video['16x9'].webm)
        }
        videoRef.current?.load()
    }, [ad])

    useEffect(() => {
        if (play) {
            videoRef.current?.parentElement?.classList.remove('hidden')
            videoRef.current?.addEventListener('ended', () => {
                videoRef.current?.parentElement?.classList.add('hidden')
            })
            videoRef.current?.play()
        }
    }, [play])

    return (
        <div className="fixed bottom-0 w-full flex justify-center hidden" id="ad">
            <video playsInline controls={false} loop={false} muted={false} ref={videoRef} width={800} height={600}>
                <source type="video/quicktime" ref={qtRef} />
                <source type="video/webm" ref={webmRef} />
            </video>
        </div>
    )
}
