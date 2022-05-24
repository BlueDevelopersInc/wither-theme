import { pullFile } from "@/api/server/files/pullFiles"
import Button from "@/components/elements/Button"
import Spinner from "@/components/elements/Spinner"
import TitledGreyBox from "@/components/elements/TitledGreyBox"
import useFlash from "@/plugins/useFlash"
import { ServerContext } from "@/state/server"
import { faCheck, faDownload, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useState } from "react"
import styled from "styled-components"
import tw from "twin.macro"

export interface Resource {
    name: string,
    id: string,
    tag: string,
    rating: {
        count: number,
        average: number
    },
    icon: {
        data: string
    },
    file: {
        url: string,
        externalUrl: string,
        type: string
    }
    premium: boolean,
    version: {
        id: number
    }
}
const PluginIcon = styled.img`
    ${tw`w-12 my-auto`}
`

export default (props: { resource: Resource }) => {
    const uuid = ServerContext.useStoreState(state => state.server.data?.uuid);
    const [isInstalling, setInstalling] = useState<boolean>(false)
    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const [installed, setInstalled] = useState<boolean>(false)
    function install() {
        if (uuid == undefined) return;
        setInstalling(true);
        pullFile(uuid, "/plugins", `https://cdn.spiget.org/file/spiget-resources/${props.resource.id}.jar`, `${props.resource.name}-${props.resource.version.id + props.resource.file.type}`, false)
            .then(r => {
                setInstalling(false);
                setInstalled(true);
                setTimeout(() => {
                    setInstalled(false);
                }, 2000)
            })
            .catch(error => {
                clearAndAddHttpError({ key: "server:plugins", error })
                setInstalling(false)
            })
    }
    return <TitledGreyBox css={[tw`text-sm uppercase w-full mb-4 mx-0`, `@media (min-width: 640px) {width: 49%}`]} title={
        <p>{props.resource.name}</p>
    }>
        <div css={tw`my-4`}>
            <div css={tw`flex w-full`}>
                {props.resource.icon.data === "" ? defaultIcon : <PluginIcon src={`data:image/jpeg;base64,${props.resource.icon.data}`} />}
                <p css={tw`my-auto ml-8`}>{props.resource.tag}</p>
            </div>
        </div>
        <div css={tw`flex justify-end gap-2`}>
            <Button size="xsmall" onClick={e => window.open(`https://www.spigotmc.org/resources/${props.resource.id}`)}>
                <FontAwesomeIcon icon={faExternalLinkAlt} />
                {' '}VIEW
            </Button>
            {
                !props.resource.premium && props.resource.file.type !== 'external' &&
                <>
                    <Button size="xsmall" onClick={e => install()} disabled={isInstalling || installed} css={isInstalling || installed ? tw`w-16` : undefined}>

                        {isInstalling ? <Spinner size="small" css={tw`mx-auto`} /> :
                            installed ?
                                <>
                                    <FontAwesomeIcon icon={faCheck} />
                                </>
                                :
                                <>
                                    <FontAwesomeIcon icon={faDownload} />{' '} INSTALL
                                </>
                        }

                    </Button>
                </>
            }
        </div>
    </TitledGreyBox>
}



const defaultIcon = <PluginIcon src={"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAMAAADVRocKAAABI1BMVEX///8qLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzWErmOLAAAAYHRSTlMAAAEDBAYHCAkLDA0TFBUWGBkaGx4fISQ8Tk9TWVtcXl9iY2ZnaWtsbm9wcXJzdnd5e3x9f4CEho2Zmquturu9v8DBw8XNzs/Q0tPV1tfa29zd3+Dh5OXm5/H0+Pv8/f6vIEXSAAACJElEQVR42u2YZ1PCQBCGEwUVGxBRDKKI2MCGKCqi2EBjRQUbFvb//woHIsMmoXiXg3Gcfb6R27xPJhzD7UoSQRAEQRBEBRmjLN49LCqGSyIFyvwjAMDjvNIRwejKFfxwtTIqXNC/dQmIy8SAUIFr7RpM3Ky5hAlGFizxFa4XRoQIPOE8Ss0bPoQ9tgXDEfzu77c9nu17/F1Ehm3FO5ZzKO0pOVF56xPJJ3QxF3Vwx/fGcPxz3F/bmv74M1bEernihyIaSnlNGH7ASuIVLWqRIeZ49yzeOYVdr2zCu1vAO2rWzRTvnMZPn98ZkxswtoN3lDbtZBCk0J3FpE9ugi9ZRIUpBsFnfeds+uUW+DfrO+qTQVDSb/l4iY/LbRiPv3zo1SUGwZt+y16P6f+gAZLUs6dXv7EL0pO/EUymuQUAB4F2AvWgVsslADgMtooPHtYrOQUAx1PN4qeOcR23AN6P1EFruks9egcxAgA4DZgUg4ETc40tAUBGddTjHWrGWmFTAJAJ1fJDmUbrtgUAZ3OV+PBZ41UBAihng8FsGTonAPj6arokRtACEpCABH9MUOIRlLgOXgywHLxSPIJ9BkHfjMYar82wHH7Nx/e2sB7frQ1I66fnaED0Fur8N/EXnC1UtRFZzbWLz606JTsY21gLdttYayNuQEQj3oVRQvUcun5rjr/dcAkd5wwkOjrO6cJAqgsjtapiqVCICh4KEgRBEATxP/gG8FmhNvgddLwAAAAASUVORK5CYII="} />

