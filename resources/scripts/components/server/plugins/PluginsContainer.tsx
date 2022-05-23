import ServerContentBlock from "@/components/elements/ServerContentBlock"
import React, { useEffect, useState } from 'react';
import FlashMessageRender from '@/components/FlashMessageRender';
import tw from 'twin.macro';
import Input from "@/components/elements/Input";
import Select from "@/components/elements/Select";
import PluginBox, { Resource } from "./PluginBox";
import Spinner from "@/components/elements/Spinner";
import axios from "axios";
import Button from "@/components/elements/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleLeft, faAngleDoubleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import useFlash from '@/plugins/useFlash';

export default () => {
    const [pageCount, setPageCount] = useState<number>(10);
    const [resources, setResources] = useState<Resource[] | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [pageNumber, setPageNumber] = useState<number>(0);
    const [maxPages, setMaxPages] = useState<number>(0)
    const { clearFlashes, clearAndAddHttpError } = useFlash();
    useEffect(() => {
        setPageNumber(1)
        update(1);
    }, [pageCount, searchQuery])

    function updatePageNumber(number: number) {
        setPageNumber(number)
        update(number);
    }

    function update(page: number) {
        setResources(null)
        clearFlashes("server:plugins")
        getResources(pageCount, searchQuery, page).then(r => {
            setResources(r.resources);
            setMaxPages(r.maxPages);
        }).catch(error => {
            clearAndAddHttpError({ key: "server:plugins", error })
        });
    }

    return <ServerContentBlock title="Plugin Manager">
        <FlashMessageRender byKey={'server:plugins'} css={tw`mb-4`} />
        <div css={tw`sm:flex`}>
            <Input placeholder="DiscordSRVUtils" name="query" className="plugins-query" onChange={e => setSearchQuery(e.currentTarget.value)} />
            <Select css={tw`sm:w-1/3`} onChange={e => { setPageCount(parseInt(e.target.value)) }} defaultValue="10">
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
            </Select>
        </div>
        <div css={[tw`w-full flex flex-wrap mt-4 `, resources == null ? tw`justify-center` : tw`justify-between`]}>
            {resources == null ?
                <Spinner size="large" centered />
                :
                <>
                    {resources.length === 0 ?
                        <p css={tw`text-center w-full`}>No Plugins found</p> :
                        <>
                            {resources.map(resource => {
                                return <PluginBox resource={resource} key={resource.id} />
                            })
                            }
                            <PageShuffle page={pageNumber} maxPages={maxPages} updatePage={updatePageNumber} />
                        </>
                    }
                </>
            }
        </div>
    </ServerContentBlock>
}

const PageShuffle = (props: { page: number, maxPages: number, updatePage: Function }) => {
    function getLastToDisplay() {
        if (props.page >= 4) return props.page + 1;
        return 5;
    }
    function getFirstToDisplay() {
        if (props.page >= 5) return props.page - 3;
        else return 1;
    }
    function getButtons() {
        const buttons : JSX.Element[] = []
        for (let i = getFirstToDisplay(); i <= getLastToDisplay(); i++) {
            if (i <= props.maxPages)
            buttons.push(
                <PageButton key={i} css={i === props.page ? undefined : tw`bg-transparent`} onClick={i == props.page ? undefined : e => props.updatePage(i)}>{i}</PageButton>
            )
        }

        return <>{buttons}</>
    }
    return <div css={tw`w-full mt-4 flex justify-center`}>
        {
            props.page > 4 &&
            <PageButton css={tw`bg-transparent`} onClick={e => props.updatePage(props.page - 1)}><FontAwesomeIcon icon={faAngleDoubleLeft} /></PageButton>
        }
        {
            getButtons()
        }
        {
            props.page < props.maxPages &&
            <PageButton css={tw`bg-transparent`} onClick={e => props.updatePage(props.page - 1)}><FontAwesomeIcon icon={faAngleDoubleRight} /></PageButton>
        }
    </div>
}

const PageButton = styled(Button)`
& {
  padding: 0;
  width: 2.5rem;
  height:2.5rem;
}
&:not(:last-child) {
    ${tw`mr-2`}
}
`

function getResources(pageCount: number, searchQuery: string, page: number): Promise<{ resources: Resource[], maxPages: number }> {
    return new Promise((resolve, reject) => {
        const url = searchQuery === "" ? `https://api.spiget.org/v2/resources/free?size=${pageCount}&page=${page}` : `https://api.spiget.org/v2/search/resources/${searchQuery}?size=${pageCount}&page=${page}`
        axios.get(url)
            .then(({ data, headers }) => resolve({ resources: data, maxPages: parseInt(headers['x-page-count']) }))
            .catch(er => {
                if (er.response === undefined) reject(er)
                else
                    if (er.response.status == 404) resolve({ resources: [], maxPages: 0 })
                    else reject(er)
            });
    })
}

