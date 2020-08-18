import React, {SetStateAction, useEffect, useState} from 'react';
import './App.scss';
import CurrencyTable from "./components/CurrencyTable/CurrencyTable";
import CurrencyInput from "./components/CurrencyInput/CurrencyInput";
import {END_AT, EXCHANGE_API_ULR, START_AT} from "./constants/urls.constant";
import {Currencies, Rate} from "./models/currencies.model";
import {Spinner} from "react-bootstrap";
import CurrencyChange from "./components/CurrencyChange/CurrencyChange";

interface Data {
    currencies: Currencies,
    currentValue: number,
    startRate: number,
    endRate: number
}

function App() {
    const [data, setData] = useState<Data>();
    const [fetching, setFetching] = useState(false);

    // We should better use Redux store or at least context, but I decided to use only local storage for this project because:
    // 1) We need to show user information after page reload;
    // 2) Project is small, so we won`t have any problems with props drilling
    useEffect((): void => {
        setFetching(true);
        checkLocalStorageIsNotEmpty().then(() => {
            setData({
                currencies: JSON.parse(localStorage.getItem('currencies') as string),
                currentValue: Number(localStorage.getItem('currentValue') as string),
                startRate: Number(localStorage.getItem('startRate') as string),
                endRate: Number(localStorage.getItem('endRate') as string),
            });
        }).finally(() => setFetching(false))
    }, [])

    const checkLocalStorageIsNotEmpty = (): Promise<void> => {
        return new Promise<void>((resolve, reject) => {
            if (!localStorage.getItem('currentValue')) {
                localStorage.setItem('currentValue', '1');
            }

            if (!localStorage.getItem('currencies')) {
                fetchExchangeAPI()
                    .catch(() => reject())
                    .finally(() => resolve())
            } else {
                resolve();
            }
        })
    }

    const fetchExchangeAPI = (currency?: Rate): Promise<void> => {
        return new Promise<void>((resolve, reject) => {
            const latestUpdatesUrl = formLatestUpdatesUrl(currency);
            const historyChangeUrl = formHistoryChangeUrl(currency);

            fetch(latestUpdatesUrl)
                .then(res => res.json())
                .then(res => {
                    localStorage.setItem('currencies', JSON.stringify(res));

                    fetch(historyChangeUrl)
                        .then(response => response.json())
                        .then(response => {
                            const currencyToCompare = response.base === Rate.USD ? Rate.EUR : Rate.USD;

                            localStorage.setItem('startRate', response.rates[START_AT][currencyToCompare]);
                            localStorage.setItem('endRate', response.rates[END_AT][currencyToCompare]);
                        })
                        .finally(() => resolve());
                })
                .catch(() => reject());
        })
    }

    const formLatestUpdatesUrl = (currency?: Rate): string => {
        return currency ? `${EXCHANGE_API_ULR}/latest?base=${currency}` : `${EXCHANGE_API_ULR}/latest`;
    }

    const formHistoryChangeUrl = (currency?: Rate): string => {
        return currency ? `${EXCHANGE_API_ULR}/history?start_at=${START_AT}&end_at=${END_AT}&base=${currency}`
            : `${EXCHANGE_API_ULR}/history?start_at=${START_AT}&end_at=${END_AT}`;
    }

    const handleValueChange = (value: string): void => {
        localStorage.setItem('currentValue', value);
        setData({
            ...data,
            currentValue: Number(value)
        } as SetStateAction<any>)
    }

    const handleFormSubmit = (newCurrency: Rate): void => {
        setFetching(true);
        fetchExchangeAPI(newCurrency)
            .then(() => {
                setData({
                    ...data,
                    currencies: JSON.parse(localStorage.getItem('currencies') as string),
                    startRate: Number(localStorage.getItem('startRate') as string),
                    endRate: Number(localStorage.getItem('endRate') as string)
                } as SetStateAction<any>)
                setFetching(false);
        });
    }

    return (
        <div className="app">
            {data && !fetching
                ?   <>
                        <div className="date">
                            Info from {data.currencies?.date}
                        </div>
                        <div className="container">
                            <CurrencyInput currentCurrency={data.currencies.base}
                                           currentValue={data.currentValue}
                                           currencies={data.currencies.rates || {}}
                                           valueChange={handleValueChange}
                                           formSubmit={handleFormSubmit}/>
                            <CurrencyChange currentCurrency={data.currencies.base} startRate={data.startRate} endRate={data.endRate}/>
                            <CurrencyTable currencies={data.currencies.rates || {}}
                                           currentValue={data.currentValue}/>
                        </div>
                    </>
                :   <Spinner animation="grow" variant="dark" />
            }
        </div>
    );
}

export default App;
