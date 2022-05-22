import ServerContentBlock from "@/components/elements/ServerContentBlock"
import React, { useEffect, useState } from 'react';
import FlashMessageRender from '@/components/FlashMessageRender';
import tw from 'twin.macro';
import Input from "@/components/elements/Input";
import Select from "@/components/elements/Select";
import PluginBox, { Resource } from "./PluginBox";
import Spinner from "@/components/elements/Spinner";
import axios from "axios";

export default () => {
    const [pageCount, setPageCount] = useState<number>(10);
    const [resources, setResources] = useState<Resource[] | null>(null);
    useEffect(() => {
        setResources(null)
        getResources(pageCount).then(setResources);
    }, [pageCount])
    return <ServerContentBlock title="Plugins">
        <FlashMessageRender byKey={'plugins'} css={tw`mb-4`} />
        <div css={tw`flex`}>
            <Input placeholder="DiscordSRVUtils" name="query" className="plugins-query" />
            <Select css={tw`sm:w-1/3`} onChange={e => { setPageCount(parseInt(e.target.value)) }} defaultValue="10">
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
            </Select>
        </div>
        <div css={tw`w-full flex flex-wrap justify-center mt-4`}>
            {resources == null ?
            <Spinner size="large" centered/>
            :
            <>
            {resources.map(resource => {
                return <PluginBox resource={resource} key={resource.id}/>
            })}
            </>
            }
        </div>
    </ServerContentBlock>
}

function getResources(pageCount: number): Promise<Resource[]> {
    return new Promise<Resource[]>((resolve, reject) => {
        axios.get(`https://api.spiget.org/v2/resources/free?size=${pageCount}`)
        .then(({ data }) => resolve(data))
        .catch(reject);
    })
}