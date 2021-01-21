export interface Config {
    streamerId : string | number 
    streamerName : string
    api : string
    primaryColor : string
    secondaryColor : string
    fontString : string
    font : string
    youtubeMetatag? : string
}

export const configuration : Config = {
    streamerId : 1,
    streamerName : 'penelope',
    api : 'https://compare.topadsservices.com',
    primaryColor : '#f79cdd',
    secondaryColor : '#34cfeb',
    fontString : "https://fonts.googleapis.com/css2?family=Hachi+Maru+Pop&display=swap",
    font : 'Roboto',
}

