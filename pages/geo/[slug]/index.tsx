import React, { FunctionComponent, useEffect, useContext } from 'react'
import AquaClient from './../../../graphql/aquaClient';
import { BONUSES_BY_NAME } from './../../../graphql/queries/bonus';
import { Bonus } from '../../../graphql/schema';
import styled from 'styled-components';
import { tablet } from '../../../components/Responsive/Breakpoints';
import { initializeAnalytics } from './../../../analytics/base';
import { cookieContext } from '../../../context/CookieContext';
import CookieDisclaimer from '../../../components/CookieDisclaimer/CookieDisclaimer';
import VideoDiscalimer from '../../../components/VideoDisclaimer/VideoDisclaimer';
import BonusStripe from '../../../components/BonusStripe/BonusStripe';
import axios from 'axios'
import lowerCase from 'lodash/lowerCase'
import Router from 'next/router'

interface Props {
    slug: string
}

const Compare: FunctionComponent<Props> = ({ slug }) => {

    useEffect(() => {
        geoLocate()
    }, [])

    const geoLocate = async () => {
        const geolocation = await axios.get('https://ipapi.co/json/')
        console.log(geolocation.data)
        console.log(slug)
        const { country_code } = geolocation.data
        console.log(lowerCase(geolocation.data.country_code))

        Router.push(`/geo/${slug}/${lowerCase(country_code)}`)
    }

    return (
        <Wrapper>
            <Container>

            </Container>
        </Wrapper>
    )

}

const Wrapper = styled.div`
        background : #e0e0e0;
        min-height : 100vh;
`

const Container = styled.div`
    display : flex;
    flex-direction : column;
    justify-content : center;
    background : #f2f2f2;


    .top-bar{
        display : flex;
        flex-direction : column;
        justify-content : center;
        max-height : 100px;
        background: ${(props) => props.theme.colors.primaryDark};
    }

    .spike{
        height : 150px;
        margin : 0rem auto;
    }

    h1{
        font-family : ${(props) => props.theme.text.secondaryFont};
        color : ${(props) => props.theme.colors.primary};
        padding : 1rem;
        text-align : center;
        font-size : 1.5rem;
    }

    ${tablet}{
        max-width : 1200px;
        margin : 0rem auto;
    }
`

export async function getServerSideProps({ query }) {

    return {
        props: {
            slug: query.slug
        }
    }
}

export default Compare
