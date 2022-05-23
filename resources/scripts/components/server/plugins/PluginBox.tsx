import TitledGreyBox from "@/components/elements/TitledGreyBox"
import React from "react"
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
    }
    premium: boolean,
}
const PluginIcon = styled.img`
    ${tw`w-12 my-auto`}
`

export default (props: { resource: Resource }) => {
    return <TitledGreyBox css={[tw`text-sm uppercase w-full mb-4 mx-0`, `@media (min-width: 640px) {width: 49%}`]} title={
        <p>{props.resource.name}</p>
    }>
        <div css={tw`my-4`}>
            <div css={tw`flex w-full`}>
                {props.resource.icon.data === "" ? defaultIcon : <PluginIcon src={`data:image/jpeg;base64,${props.resource.icon.data}`} />}
                <p css={tw`my-auto ml-8`}>{props.resource.tag}</p>
            </div>
        </div>
    </TitledGreyBox>
}

const defaultIcon = <PluginIcon src={"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAMAAADVRocKAAABI1BMVEX///8qLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzUqLzWErmOLAAAAYHRSTlMAAAEDBAYHCAkLDA0TFBUWGBkaGx4fISQ8Tk9TWVtcXl9iY2ZnaWtsbm9wcXJzdnd5e3x9f4CEho2Zmquturu9v8DBw8XNzs/Q0tPV1tfa29zd3+Dh5OXm5/H0+Pv8/f6vIEXSAAACJElEQVR42u2YZ1PCQBCGEwUVGxBRDKKI2MCGKCqi2EBjRQUbFvb//woHIsMmoXiXg3Gcfb6R27xPJhzD7UoSQRAEQRBEBRmjLN49LCqGSyIFyvwjAMDjvNIRwejKFfxwtTIqXNC/dQmIy8SAUIFr7RpM3Ky5hAlGFizxFa4XRoQIPOE8Ss0bPoQ9tgXDEfzu77c9nu17/F1Ehm3FO5ZzKO0pOVF56xPJJ3QxF3Vwx/fGcPxz3F/bmv74M1bEernihyIaSnlNGH7ASuIVLWqRIeZ49yzeOYVdr2zCu1vAO2rWzRTvnMZPn98ZkxswtoN3lDbtZBCk0J3FpE9ugi9ZRIUpBsFnfeds+uUW+DfrO+qTQVDSb/l4iY/LbRiPv3zo1SUGwZt+y16P6f+gAZLUs6dXv7EL0pO/EUymuQUAB4F2AvWgVsslADgMtooPHtYrOQUAx1PN4qeOcR23AN6P1EFruks9egcxAgA4DZgUg4ETc40tAUBGddTjHWrGWmFTAJAJ1fJDmUbrtgUAZ3OV+PBZ41UBAihng8FsGTonAPj6arokRtACEpCABH9MUOIRlLgOXgywHLxSPIJ9BkHfjMYar82wHH7Nx/e2sB7frQ1I66fnaED0Fur8N/EXnC1UtRFZzbWLz606JTsY21gLdttYayNuQEQj3oVRQvUcun5rjr/dcAkd5wwkOjrO6cJAqgsjtapiqVCICh4KEgRBEATxP/gG8FmhNvgddLwAAAAASUVORK5CYII="} />

