import React, {ReactElement} from 'react';
import {Table} from "react-bootstrap";
import {CurrenciesRates} from "../../models/currencies.model";

interface Props {
    currencies: CurrenciesRates,
    currentValue: number
}

const CurrencyTable = (props: Props): ReactElement => {
    const {currencies, currentValue} = props;

    const renderRows = (): JSX.Element[] => {
        const rows: JSX.Element[] = [];

        Object.keys(currencies).forEach((item: string, index: number) => {
            rows.push(
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item}</td>
                    <td>{Math.ceil((currencies[item] * currentValue) * 100) / 100}</td>
                </tr>
            )
        })

        return rows;
    }

    return (
        <>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Currency</th>
                    <th>Amount</th>
                </tr>
                </thead>
                <tbody>
                    {renderRows()}
                </tbody>
            </Table>
        </>
    )
}

export default CurrencyTable;