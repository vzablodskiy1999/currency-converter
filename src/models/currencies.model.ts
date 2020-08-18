export enum Rate {
    USD = 'USD',
    CAD = 'CAD',
    HKD = 'HKD',
    ISK = 'ISK',
    PHP = 'PHP',
    DKK = 'DKK',
    HUF = 'HUF',
    CZK = 'CZK',
    AUD = 'AUD',
    RON = 'RON',
    SEK = 'SEK',
    IDR = 'IDR',
    INR = 'INR',
    BRL = 'BRL',
    RUB = 'RUB',
    HRK = 'HRK',
    JPY = 'JPY',
    THB = 'THB',
    CHF = 'CHF',
    SGD = 'SGD',
    PLN = 'PLN',
    EUR = 'EUR'
}

export type CurrenciesRates = {
    [key: string]: number
}

export interface Currencies {
    rates?: CurrenciesRates,
    base: Rate,
    date: string
}