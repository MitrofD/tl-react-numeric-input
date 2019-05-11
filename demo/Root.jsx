// @flow
import React, { useState } from 'react';
import { hot } from 'react-hot-loader/root';
import TLNumericInput from '../src';

const Root = () => {
  const [
    disabledDecimal,
    setDecimalDisabled,
  ] = useState(false);

  const [
    required,
    setRequired,
  ] = useState(false);

  const onChangeDecimalCheckbox = (event: SyntheticEvent<HTMLInputElement>) => {
    const checkbox = event.currentTarget;
    setDecimalDisabled(checkbox.checked);
  };

  const onChangeRequiredCheckbox = (event: SyntheticEvent<HTMLInputElement>) => {
    const checkbox = event.currentTarget;
    setRequired(checkbox.checked);
  };

  return (
    <div className="Root row">
      <div className="col-12 mb-3">
        <h1 className="text-center text-tl-l text-truncate">TLNumericInput</h1>
      </div>
      <div className="col-sm-8 offset-sm-2 col-md-6 offset-md-3 mt-3 mb-3 control">
        <div className="border border-tl-l rounded p-3">
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
            min="100"
            max="1000"
          />
        </div>
      </div>
    </div>
  );
};

export default hot(Root);
