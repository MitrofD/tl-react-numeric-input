// @flow
import React from 'react';

type NumVal = string | number;
type ParseFunc = (NumVal) => number;

const EMPTY_STR = '';
const MINUS_STR = '-';
const ZERO_STR = '0';

type Props = Object & {
  className?: ?string,
  disabledDecimal?: boolean,
  min?: ?NumVal,
  max?: ?NumVal,
  onSet?: ?Function,
};

const defaultProps = {
  className: null,
  disabledDecimal: false,
  min: null,
  max: null,
  onSet: null,
};

const genEmptyFunc = (min: ?number) => {
  if (typeof min !== 'number' || min < 0) {
    return (val: string) => {
      const firstVal = val[0];
      return firstVal === MINUS_STR ? MINUS_STR : EMPTY_STR;
    };
  }

  return () => EMPTY_STR;
};

const genRegExp = (props: Props) => {
  let regExpStr = props.disabledDecimal ? '0*(0|\\d+)' : '0*((0|\\d+)\\.?\\d*)';

  if (typeof props.min !== 'number' || props.min < 0) {
    regExpStr = `(-?)${regExpStr}`;
  } else {
    regExpStr = `()${regExpStr}`;
  }

  regExpStr = `^${regExpStr}`;
  return new RegExp(regExpStr);
};

const getRequiredVal = (min: ?number, isRequred: any) => {
  // eslint-disable-next-line no-extra-boolean-cast
  if (!!isRequred) {
    return typeof min === 'number' ? min.toString() : ZERO_STR;
  }

  return EMPTY_STR;
};

const getClassName = (propsVal: any) => {
  const defClassName = 'TLNumericInput';

  if (typeof propsVal === 'string') {
    return `${defClassName} ${propsVal}`;
  }

  return defClassName;
};

function getDefaultVal(val: string) {
  const pureValue = this.getValue(val);
  const numVal = this.parseFunc(pureValue);

  if (Number.isNaN(numVal)) {
    return this.requiredVal;
  }

  if (typeof this.min === 'number' && numVal < this.min) {
    return this.min.toString();
  }

  if (typeof this.max === 'number' && numVal >= this.max) {
    return this.max.toString();
  }

  return pureValue;
}

const getEvent = (propsVal: any) => {
  if (typeof propsVal === 'function') {
    return propsVal;
  }

  return () => {};
};

const getParseFunc = (propsVal: any) => {
  if (propsVal) {
    return parseInt;
  }

  return parseFloat;
};

const getExtremum = (attr: string, val: ?NumVal, parseFunc: ParseFunc, dDecimal?: boolean) => {
  if (typeof val === 'string' || typeof val === 'number') {
    const pVal = parseFunc(val);

    if (Number.isNaN(pVal)) {
      throw new Error(`Attribute ${attr} is incorrect`);
    }

    if (dDecimal && pVal % 1 !== 0) {
      throw new Error(`Attribute ${attr} has to be "integer" type`);
    }

    return pVal;
  }

  return null;
};

const checkExtremums = (min: ?number, max: ?number) => {
  if ((typeof min === 'number' && typeof max === 'number') && min > max) {
    throw new Error('Attribute min can\'t be great than max');
  }
};

function setFromVal(val: string) {
  const pureValue = this.getValue(val);

  if (this.input.value !== pureValue) {
    this.input.value = pureValue;
    this.propsOnSet(this);
  }
}

function safeSetFromVal(val: any) {
  let setVal = EMPTY_STR;

  try {
    setVal = val.toString();
    // eslint-disable-next-line no-empty
  } catch (sError) {}

  setFromVal.call(this, setVal);
}

const shallowCompare = (newObj: Object, prevObj: Object) => {
  const newProps = Object.keys(newObj);
  const newPropsLength = newProps.length;
  let i = 0;

  for (; i < newPropsLength; i += 1) {
    const newProp = newProps[i];
    const newVal = newObj[newProp];
    const oldVal = prevObj[newProp];

    if (newVal !== oldVal) {
      return true;
    }
  }

  return false;
};

class TLNumericInput extends React.Component<Props> {
  defaultValue: string;

  emptyFunc: Function;

  focusVal: ?NumVal;

  max: ?number;

  min: ?number;

  needRegExp: RegExp;

  input: HTMLInputElement;

  parseFunc: ParseFunc;

  propsOnBlur: Function;

  propsOnChange: Function;

  propsOnError: Function;

  propsOnFocus: Function;

  propsOnSet: Function;

  requiredVal: string;

  constructor(props: Props, context: null) {
    super(props, context);
    this.propsOnBlur = getEvent(props.onBlur);
    this.propsOnChange = getEvent(props.onChange);
    this.propsOnError = getEvent(props.onError);
    this.propsOnFocus = getEvent(props.onChange);
    this.propsOnSet = getEvent(props.onSet);
    this.parseFunc = getParseFunc(props.disabledDecimal);
    this.needRegExp = genRegExp(props);

    let max: ?number = null;
    let min: ?number = null;

    try {
      max = getExtremum('max', props.max, this.parseFunc, props.disabledDecimal);
    } catch (error) {
      this.propsOnError(error);
    }

    try {
      min = getExtremum('min', props.min, this.parseFunc, props.disabledDecimal);
    } catch (error) {
      this.propsOnError(error);
    }

    try {
      checkExtremums(min, max);
    } catch (error) {
      min = null;
      this.propsOnError(error);
    }

    this.max = max;
    this.min = min;
    this.emptyFunc = genEmptyFunc(this.min);
    this.requiredVal = getRequiredVal(this.min, props.required);

    let defaultValue = EMPTY_STR;

    if (props.value && typeof props.value.toString === 'function') {
      defaultValue = props.value.toString();
    } else if (props.defaultValue && typeof props.defaultValue.toString === 'function') {
      defaultValue = props.defaultValue.toString();
    }

    this.defaultValue = getDefaultVal.call(this, defaultValue);

    const self: any = this;
    self.onBlur = this.onBlur.bind(this);
    self.onChange = this.onChange.bind(this);
    self.onFocus = this.onFocus.bind(this);
    self.onRef = this.onRef.bind(this);
  }

  shouldComponentUpdate(nextProps: Props) {
    const propsCopy = { ...this.props };

    const {
      className,
      disabledDecimal,
      onBlur,
      onChange,
      onError,
      onFocus,
      onSet,
      required,
    } = propsCopy;

    let needCheckExtremums = false;
    let needUpdateMax = false;
    let needUpdateMin = false;
    let needUpdateRegExp = false;
    let error: ?Error = null;

    if (nextProps.className !== className) {
      propsCopy.className = nextProps.className;
      this.input.className = getClassName(nextProps.className);
    }

    if (nextProps.onBlur !== onBlur) {
      propsCopy.onBlur = nextProps.onBlur;
      this.propsOnBlur = getEvent(nextProps.onBlur);
    }

    if (nextProps.onChange !== onChange) {
      propsCopy.onChange = nextProps.onChange;
      this.propsOnChange = getEvent(nextProps.onChange);
    }

    if (nextProps.onError !== onError) {
      propsCopy.onError = nextProps.onError;
      this.propsOnError = getEvent(nextProps.onError);
    }

    if (nextProps.onFocus !== onFocus) {
      propsCopy.onFocus = nextProps.onFocus;
      this.propsOnFocus = getEvent(nextProps.onFocus);
    }

    if (nextProps.onSet !== onSet) {
      propsCopy.onSet = nextProps.onSet;
      this.propsOnSet = getEvent(nextProps.onSet);
    }

    if (nextProps.max !== this.max) {
      needUpdateMax = true;
      propsCopy.max = nextProps.max;
    }

    if (nextProps.min !== this.max) {
      needUpdateMin = true;
      needUpdateRegExp = true;
      propsCopy.min = nextProps.min;
      this.emptyFunc = genEmptyFunc(nextProps.min);
    }

    if (nextProps.disabledDecimal !== disabledDecimal) {
      needUpdateMax = true;
      needUpdateMin = true;
      needUpdateRegExp = true;
      this.parseFunc = getParseFunc(nextProps.disabledDecimal);
    }

    if (needUpdateMax) {
      needCheckExtremums = true;
      let nMax: ?number = null;

      try {
        nMax = getExtremum('max', nextProps.max, this.parseFunc, nextProps.disabledDecimal);
      } catch (eError) {
        error = eError;
      }

      this.max = nMax;
    }

    if (needUpdateMin) {
      needCheckExtremums = true;
      let nMin: ?number = null;

      try {
        nMin = getExtremum('min', nextProps.min, this.parseFunc, nextProps.disabledDecimal);
      } catch (eError) {
        error = eError;
      }

      this.min = nMin;
    }

    if (needCheckExtremums) {
      needUpdateRegExp = true;

      try {
        checkExtremums(this.min, this.max);
      } catch (eError) {
        this.min = null;
        error = eError;
      }
    }

    if (needUpdateRegExp) {
      this.needRegExp = genRegExp(nextProps);
      safeSetFromVal.call(this, this.input.value);
    }

    if (nextProps.value) {
      safeSetFromVal.call(this, nextProps.value);
    }

    if (needCheckExtremums || nextProps.required !== required) {
      propsCopy.required = nextProps.required;
      this.requiredVal = getRequiredVal(this.min, nextProps.required);
      this.input.value = getDefaultVal.call(this, this.input.value);
    }

    this.propsOnError(error);
    return shallowCompare(nextProps, propsCopy);
  }

  onBlur(event: SyntheticEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    input.value = getDefaultVal.call(this, input.value);

    if (this.focusVal !== input.value) {
      this.propsOnSet(this);
    }

    this.propsOnBlur(event);
  }

  onChange(event: SyntheticEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const pureValue = this.getValue(input.value);
    input.value = pureValue;
    /*
    this.propsOnChange(event);
    this.propsOnSet(this);
    */
  }

  onFocus(event: SyntheticEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const value = input.value.trim();
    input.setSelectionRange(0, value.length);
    this.focusVal = value;
    this.propsOnFocus(event);
  }

  onRef(mbInput: ?HTMLInputElement) {
    if (mbInput) {
      this.input = mbInput;
    }
  }

  getValue(value: string): any {
    const cleanValue = value.trim();
    const numVal = this.parseFunc(cleanValue);

    if (Number.isNaN(numVal)) {
      return this.emptyFunc(cleanValue);
    }

    const matches = (cleanValue.match(this.needRegExp): any);

    if (matches) {
      return matches[1] + matches[2];
    }

    return this.emptyFunc(cleanValue);
  }

  get name() {
    const {
      name,
    } = this.props;

    return name || null;
  }

  get value() {
    const numVal = this.parseFunc(this.input.value);
    return Number.isNaN(numVal) ? null : numVal;
  }

  render() {
    const inputProps = { ...this.props };
    delete inputProps.disabledDecimal;
    delete inputProps.min;
    delete inputProps.max;
    delete inputProps.onBlur;
    delete inputProps.onChange;
    delete inputProps.onFocus;
    delete inputProps.onSet;
    delete inputProps.value;
    delete inputProps.required;
    delete inputProps.ref;

    return (
      <input
        {...inputProps}
        autoComplete="off"
        className={getClassName(inputProps.className)}
        defaultValue={this.defaultValue}
        onBlur={this.onBlur}
        onChange={this.onChange}
        onFocus={this.onFocus}
        type="text"
        ref={this.onRef}
      />
    );
  }
}

TLNumericInput.defaultProps = defaultProps;

export default TLNumericInput;
