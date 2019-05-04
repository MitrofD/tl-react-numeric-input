import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';

type NumVal = string | number;
type ParseFunc = (NumVal) => number;

const BACKSPACE_KEY_CODE = 8;
const DELETE_KEY_CODE = 46;
const EMPTY = '';
const MINUS = '-';

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
      return firstVal === MINUS ? MINUS : EMPTY;
    };
  }

  return () => EMPTY;
};

const genRegExp = (props: Props) => {
  let regExpStr = props.disabledDecimal ? '0*(\\d*)' : '0*((0|\\d+)\\.?\\d*)';

  if (typeof props.min !== 'number' || props.min < 0) {
    regExpStr = `(-?)${regExpStr}`;
  } else {
    regExpStr = `()${regExpStr}`;
  }

  regExpStr = `^${regExpStr}`;

  return new RegExp(regExpStr);
};

const getClassName = (propsVal: any) => {
  const defClassName = 'TLNumericInput';

  if (propsVal) {
    if (typeof propsVal === 'string') {
      return `${defClassName} ${propsVal}`;
    }

    throw new Error('Attribute className has to be "string" type');
  }

  return defClassName;
};

const getEvent = (eventName: string, propsVal: any) => {
  if (propsVal) {
    if (typeof propsVal === 'function') {
      return propsVal;
    }

    throw new Error(`Attribute ${eventName} has to be "funtion" type`);
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
  if (val) {
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
  const pureValue = this.getPureValue(val);

  if (this.input.value !== pureValue) {
    this.isDeleteMode = false;
    this.input.value = pureValue;
    this.propsOnSet(pureValue, this.input);
  }
}

function safeSetFromVal(val: any) {
  let setVal = EMPTY;

  try {
    setVal = val.toString();
    // eslint-disable-next-line no-empty
  } catch (sError) {}

  setFromVal.call(this, setVal);
}

class TLNumericInput extends React.Component<Props> {
  static defaultProps = defaultProps;

  isDeleteMode = false;

  constructor(props: Props, context: null) {
    super(props, context);
    this.propsOnBlur = getEvent('onBlur', props.onBlur);
    this.propsOnChange = getEvent('onChange', props.onChange);
    this.propsOnKeyDown = getEvent('onKeyDown', props.onKeyDown);
    this.propsOnSet = getEvent('onSet', props.onSet);
    this.parseFunc = getParseFunc(props.disabledDecimal);
    this.needRegExp = genRegExp(props);
    this.max = getExtremum('max', props.max, this.parseFunc, props.disabledDecimal);
    this.min = getExtremum('min', props.min, this.parseFunc, props.disabledDecimal);
    checkExtremums(this.min, this.max);
    this.emptyFunc = genEmptyFunc(this.min);

    let defaultValue = EMPTY;

    if (props.value && typeof props.value.toString === 'function') {
      defaultValue = props.value.toString();
    } else if (props.defaultValue && typeof props.defaultValue.toString === 'function') {
      defaultValue = props.defaultValue.toString();
    }

    this.defaultValue = this.getPureValue(defaultValue);

    const self: any = this;
    self.onBlur = this.onBlur.bind(this);
    self.onChange = this.onChange.bind(this);
    self.onKeyDown = this.onKeyDown.bind(this);
    self.onRef = this.onRef.bind(this);
  }

  shouldComponentUpdate(nextProps: Props) {
    const {
      className,
      disabledDecimal,
      onBlur,
      onChange,
      onKeyDown,
      onSet,
      max,
      min,
    } = this.props;

    let needCheckExtremums = false;
    let needUpdateMax = false;
    let needUpdateMin = false;
    let needUpdateRegExp = false;

    if (nextProps.className !== className) {
      this.props.className = nextProps.className;
      this.input.className = getClassName(nextProps.className);
    }

    if (nextProps.onBlur !== onBlur) {
      this.props.onBlur = nextProps.onBlur;
      this.propsOnBlur = getEvent('onBlur', nextProps.onBlur);
    }

    if (nextProps.onChange !== onChange) {
      this.props.onChange = nextProps.onChange;
      this.propsOnChange = getEvent('onChange', nextProps.onChange);
    }

    if (nextProps.onKeyDown !== onKeyDown) {
      this.props.onKeyDown = nextProps.onKeyDown;
      this.propsOnKeyDown = getEvent('onKeyDown', nextProps.onKeyDown);
    }

    if (nextProps.onSet !== onSet) {
      this.props.onSet = nextProps.onSet;
      this.propsOnSet = getEvent('onSet', nextProps.onSet);
    }

    if (nextProps.max !== max) {
      needUpdateMax = true;
      this.props.max = nextProps.max;
    }

    if (nextProps.min !== min) {
      needUpdateMin = true;
      needUpdateRegExp = true;
      this.props.min = nextProps.min;
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
      this.max = getExtremum('max', nextProps.max, this.parseFunc, nextProps.disabledDecimal);
    }

    if (needUpdateMin) {
      needCheckExtremums = true;
      this.min = getExtremum('min', nextProps.min, this.parseFunc, nextProps.disabledDecimal);
    }

    if (needCheckExtremums) {
      needUpdateRegExp = true;
      checkExtremums(this.min, this.max);
    }

    if (needUpdateRegExp) {
      this.needRegExp = genRegExp(nextProps);
      safeSetFromVal.call(this, this.input.value);
    }

    if (nextProps.value) {
      safeSetFromVal.call(this, nextProps.value);
    }

    return shallowCompare(this, nextProps);
  }

  onBlur(event: SyntheticEvent<HTMLInputElement>) {
    if (!this.isDeleteMode) {
      this.propsOnBlur(event);
      return;
    }

    this.isDeleteMode = false;
    const input = event.currentTarget;
    const pureValue = this.getPureValue(input.value);
    input.value = pureValue;
    this.propsOnBlur(event);
    this.propsOnSet(pureValue, this.input);
  }

  onChange(event: SyntheticEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const pureValue = this.getPureValue(input.value);

    if (!this.isDeleteMode) {
      input.value = pureValue;
    }

    this.propsOnChange(event);
    this.propsOnSet(pureValue, this.input);
  }

  onKeyDown(event: SyntheticKeyboardEvent<HTMLInputElement>) {
    this.isDeleteMode = event.keyCode === BACKSPACE_KEY_CODE || event.keyCode === DELETE_KEY_CODE;
    this.propsOnKeyDown(event);
  }

  onRef(mbInput: ?HTMLInputElement) {
    if (mbInput) {
      this.input = mbInput;
    }
  }

  getPureValue(value: string): any {
    const cleanValue = value.trim();
    const numVal = this.parseFunc(cleanValue);

    if (Number.isNaN(numVal)) {
      return this.emptyFunc(cleanValue);
    }

    if (typeof this.min === 'number' && numVal < this.min) {
      return this.min;
    }

    if (typeof this.max === 'number' && numVal > this.max) {
      return this.max;
    }

    const matches: any[] = (cleanValue.match(this.needRegExp): any);
    return matches[1] + matches[2];
  }

  defaultValue: string;

  emptyFunc: Function;

  max: ?number;

  min: ?number;

  needRegExp: RegExp;

  input: HTMLInputElement;

  parseFunc: ParseFunc;

  propsOnBlur: Function;

  propsOnChange: Function;

  propsOnKeyDown: Function;

  propsOnSet: Function;

  render() {
    const inputProps = Object.assign({}, this.props);
    delete inputProps.disabledDecimal;
    delete inputProps.min;
    delete inputProps.max;
    delete inputProps.onBlur;
    delete inputProps.onChange;
    delete inputProps.onKeyDown;
    delete inputProps.onSet;
    delete inputProps.value;
    delete inputProps.ref;

    return (
      <input
        {...inputProps}
        autoComplete="off"
        className={getClassName(inputProps.className)}
        defaultValue={this.defaultValue}
        onBlur={this.onBlur}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
        type="text"
        ref={this.onRef}
      />
    );
  }
}

export default TLNumericInput;
