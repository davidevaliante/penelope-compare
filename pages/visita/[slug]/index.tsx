import React from 'react'
import AquaClient from '../../../graphql/aquaClient'
import Head from 'next/head'
import { FunctionComponent } from 'react';

interface Props {
    redirect: string
}

export const GET_BONUS_BY_SLUG = `
    query GET_BONUS_BY_SLUG($slug:String){
        bonuses(where:{ slug: $slug, country: {code:"it"}}){
        id
        name
        country{
          code
        }
        bonus_guide{
          slug
        }
        rating
        withDeposit
        noDeposit
        backgroundColor
        borderColor
        link
        description
        legacyId
        circular_image{
            url
        }
        }   
    }
`

const index: FunctionComponent<Props> = ({ redirect }) => {

    console.log('redirecting to unibt')
    return (
        <div>
            <Head>
                <meta httpEquiv='refresh' content={`0.1;url=${redirect}`}></meta>
            </Head>
        </div>
    )
}

// unibet https://dspk.kindredplc.com/redirect.aspx?pid=5615153&bid=27508

export async function getServerSideProps({ query, res }) {


    const slug = query.slug as string

    if (slug !== 'unibet' && slug !== 'leo_vegas') {
        const aquaClient = new AquaClient(`https://spikeapistaging.tech/graphql`)

        const response = await aquaClient.query({
            query: GET_BONUS_BY_SLUG,
            variables: { slug: slug }
        })

        res.writeHead(301, {
            Location: response.data.data.bonuses[0].link
        });
        res.end();
    }

    let redirect

    if (slug === 'unibet') redirect = 'https://dspk.kindredplc.com/redirect.aspx?pid=33001529&bid=27508'
    if (slug === 'leo_vegas') redirect = 'https://ads.leovegas.com/redirect.aspx?pid=3661059&bid=14965'

    return {
        props: {
            redirect
        }
    }
}

export default index
