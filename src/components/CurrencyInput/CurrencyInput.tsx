import React, {ReactElement, SetStateAction, useState} from "react";
import {DropdownButton, InputGroup, Dropdown, FormControl, Button} from "react-bootstrap";
import {CurrenciesRates, Rate} from "../../models/currencies.model";

interface Props {
    currentCurrency: Rate,
    currentValue: number,
    currencies: CurrenciesRates,
    valueChange: (value: string) => void,
    formSubmit: (value: Rate) => void
}

const CurrencyInput = (props: Props): ReactElement => {
    const {currentValue, currentCurrency, currencies} = props;
    const [newCurrency, setNewCurrency] = useState(currentCurrency);
    const [formDirty, setFormDirty] = useState(false);

    const renderDropdownItems = (): JSX.Element[] => {
        const items: JSX.Element[] = [];
        Object.keys(currencies).forEach((item: string, index: number) => {
            items.push(
                <Dropdown.Item eventKey={item} key={index} onSelect={(eventKey: any): void => handleCurrentCurrencyChange(eventKey)}>
                    {item}
                </Dropdown.Item>
            )
        })

        return items;
    }

    const handleCurrentCurrencyChange = (currency: string): void => {
        setNewCurrency(currency as SetStateAction<any>);
        setFormDirty(true);
    }

    const handleInputChange = (val: string): void => {
        props.valueChange(val);
    }

    const handleSubmit = (): void => {
        setFormDirty(false);
        props.formSubmit(newCurrency);
    }

    const isBtnDisabled = (): boolean => {
        return !formDirty;
    }

    return (
        <div className='d-flex justify-content-between'>
            <InputGroup className="mb-3">
                <DropdownButton
                    as={InputGroup.Prepend}
                    variant="outline-secondary"
                    title={newCurrency}
                >
                    {renderDropdownItems()}
                </DropdownButton>
                <InputGroup.Append>
                    <Button variant="primary" onClick={handleSubmit}
                            disabled={isBtnDisabled()}>Submit</Button>
                </InputGroup.Append>
            </InputGroup>
            <InputGroup>
                <FormControl defaultValue={currentValue} onChange={(e) => handleInputChange(e.target.value)}/>
                <InputGroup.Append className="align-items-start">
                    <InputGroup.Text>{currentCurrency}</InputGroup.Text>
                </InputGroup.Append>
            </InputGroup>
        </div>
    )
}

export default CurrencyInput;