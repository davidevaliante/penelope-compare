import React, { FunctionComponent, useEffect, useContext } from 'react'
import AquaClient from './../../graphql/aquaClient';
import { BONUSES_BY_NAME, STREAMER_BY_ID } from './../../graphql/queries/bonus';
import { Bonus } from '../../graphql/schema';
import styled from 'styled-components';
import { tablet } from '../../components/Responsive/Breakpoints';
import { initializeAnalytics } from './../../analytics/base';
import { cookieContext } from '../../context/CookieContext';
import CookieDisclaimer from '../../components/CookieDisclaimer/CookieDisclaimer';
import VideoDiscalimer from '../../components/VideoDisclaimer/VideoDisclaimer';
import BonusStripe from '../../components/BonusStripe/BonusStripe';
import { Streamer, StreamerBonus } from './../../models/streamer';
import {configuration} from '../../configuration'
import axios from 'axios';
import  Router  from 'next/router';
import lowerCase  from 'lodash/lowerCase'
import { useState } from 'react';
import { CircularProgress } from '@material-ui/core';
import FullPageLoader from './../../components/FullPageLoader';

interface Props {
    streamerData : Streamer
    bonusToShow : string[]
}

const Compare: FunctionComponent<Props> = ({ streamerData, bonusToShow }) => {

    const [country, setCountry] = useState<string | undefined>(undefined)
    const [bonuses, setBonuses] = useState<StreamerBonus[] | undefined>(undefined)

    console.log(streamerData)
   
    useEffect(() => {
        geoLocate()
    }, [])

    const geoLocate = async () => {
        const geolocation = await axios.get('https://ipapi.co/json/')
        const { country_code } = geolocation.data
        getBonusByName()
        if(country_code) setCountry(lowerCase(country_code))
    }

    const getBonusByName = () => {
        const streamerBonuses = streamerData.bonuses
        const placeholder : StreamerBonus[] = []

        bonusToShow.forEach((bonusCode) =>{
            const b = streamerBonuses.find(b => b.compareCode === bonusCode)
            if(b) placeholder.push(b)
        })

        setBonuses(placeholder)
        console.log(placeholder, 'bonus to show')
    }
    

    if(!country) return <FullPageLoader />
    return (
        <Wrapper>
            <Container>
                <div className='top-bar'>
                    <img className='logo' src='/icons/app_icon.png' />
                </div>

                <h1>Top Casino choice for this Slot Machine</h1>

                {bonuses && bonuses.map((bonus : StreamerBonus) => <BonusStripe key={`${bonus.name}`} bonus={bonus} countryCode={country} />)}

                <div style={{ padding: '1rem' }}>
                    <VideoDiscalimer />
                </div>
                <div className='bottom'>
                    <p style={{textAlign : 'center'}}>This service is provided by <a href='https://www.topaffiliation.com'>Top Affiliation</a></p>
                </div>
            </Container>
        </Wrapper>
    )

}


const Wrapper = styled.div`
        background : #f3f3f3;
        min-height : 100vh;

        .bottom{
            padding : 1rem;
            font-family  : 'Roboto', sans-serif;
        }

`

const Container = styled.div`
    display : flex;
    flex-direction : column;
    justify-content : center;
    background : #f8f8f8;
    box-shadow:         3px 3px 5px 0px rgba(50, 50, 50, 0.75);

    .top-bar{
        display : flex;
        flex-direction : column;
        justify-content : center;
        max-height : 100px;
        background: ${(props) => props.theme.colors.primary};
        box-shadow:         3px 3px 5px 0px rgba(50, 50, 50, 0.75);
    }

    .logo{
        height : 90px;
        margin : .5rem auto;
    }

    h1{
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

    const pickedBonus = query.options

    const aquaClient = new AquaClient()


    const bonusToShow = pickedBonus.split(',')

    const streamer = await axios.get(`${configuration.api}/streamers/${configuration.streamerId}`)
   
    return {
        props: {
            streamerData : streamer.data as Streamer,
            bonusToShow : bonusToShow,
        }
    }
}

export default Compare
