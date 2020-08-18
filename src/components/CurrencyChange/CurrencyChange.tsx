import React, {ReactElement} from "react";
import {Rate} from "../../models/currencies.model";
import {calculateDifferenceInPercents} from "../../utils/currency.utils";

interface Props {
    currentCurrency: Rate,
    startRate: number,
    endRate: number
}

const CurrencyChange = (props: Props): ReactElement => {
    const {currentCurrency, startRate, endRate} = props;

    const getValuation = (): string => {
        return (calculateDifferenceInPercents(endRate, startRate)).toFixed(2);
    }

    return (
        <div>
            <h5>
                That is an index of how much {currentCurrency} change its valuation between 2 dates: March 26th, 2015 and June 13th, 2017.
            </h5>
            <span>
                Current currency is compared with USD, if current currency is USD -  we take EUR for comparison.
            </span>
            <div className={`valuation-text ${Number(getValuation()) > 0 ? 'text-success' : 'text-danger'}`}>
                Valuation amount: {getValuation()}%
            </div>
        </div>

    )
}

export default CurrencyChange;