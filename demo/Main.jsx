// @flow
import React, { useState } from 'react';
import { hot } from 'react-hot-loader/root';
import TLNumericInput from '../src';
import './main.scss';


const Main = () => {
  const [
    disabledDecimal,
    setDecimalDisabled,
  ] = useState(false);

  const [
    required,
    setRequired,
  ] = useState(false);

  const [
    min,
    setMin,
  ] = useState(null);

  const [
    max,
    setMax,
  ] = useState(null);

  const [
    error,
    setError,
  ] = useState(null);

  const [
    value,
    setValue,
  ] = useState(null);

  const onSetMinNumericInput = (input: TLNumericInput) => {
    setMin(input.value);
  };

  const onSetMaxNumericInput = (input: TLNumericInput) => {
    setMax(input.value);
  };

  const onChangeDecimalCheckbox = (event: SyntheticEvent<HTMLInputElement>) => {
    const checkbox = event.currentTarget;
    setDecimalDisabled(checkbox.checked);
  };

  const onChangeRequiredCheckbox = (event: SyntheticEvent<HTMLInputElement>) => {
    const checkbox = event.currentTarget;
    setRequired(checkbox.checked);
  };

  const onErrorNumValue = (inputError: ?Error) => {
    let newValue: ?string = null;

    if (inputError) {
      newValue = inputError.message;
    }

    if (error !== newValue) {
      setError(newValue);
    }
  };

  const onSetNumValue = (input: TLNumericInput) => {
    setValue(input.value);
  };

  return (
    <div className="Main row">
      <div className="col-12 mb-3">
        <h1 className="text-center text-tl-l text-truncate">TLNumericInput</h1>
      </div>
      <div className="col-sm-8 offset-sm-2 col-md-6 offset-md-3 mt-3 mb-3 control">
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}
        <div className="inner p-3">
          <div className="row">
            <div className="form-group col-md-6">
              <label htmlFor="min-input">Min:</label>
              <TLNumericInput
                className="form-control"
                id="min-input"
                onSet={onSetMinNumericInput}
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="max-input">Max:</label>
              <TLNumericInput
                className="form-control"
                id="max-input"
                onSet={onSetMaxNumericInput}
              />
            </div>
          </div>
          <div className="form-check form-check-inline">
            <label>
              <input
                defaultChecked={disabledDecimal}
                onChange={onChangeDecimalCheckbox}
                type="checkbox"
              />
              Disabled decimal
            </label>
          </div>
          <div className="form-check form-check-inline">
            <label>
              <input
                defaultChecked={required}
                onChange={onChangeRequiredCheckbox}
                type="checkbox"
              />
              Is required
            </label>
          </div>
        </div>
      </div>
      <div className="col-sm-6 offset-sm-3 col-md-4 offset-md-4 mt-3">
        <div className="form-group">
          <TLNumericInput
            required={required}
            className="form-control form-control-lg"
            disabledDecimal={disabledDecimal}
            onError={onErrorNumValue}
            onSet={onSetNumValue}
            min={min}
            max={max}
            value={value}
          />
        </div>
      </div>
    </div>
  );
};

export default hot(Main);
