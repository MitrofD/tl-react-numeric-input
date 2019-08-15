[![TLNumericInput](https://repository-images.githubusercontent.com/184097031/25e8c000-be37-11e9-9a69-042a652b5cd2)](https://www.npmjs.com/package/tl-react-numeric-input)

# TLNumericInput

> React component as a numeric input field

[![Known Vulnerabilities](https://snyk.io//test/github/MitrophD/tl-react-numeric-input/badge.svg?targetFile=package.json)](https://snyk.io//test/github/MitrophD/tl-react-numeric-input?targetFile=package.json) ![GitHub issues](https://img.shields.io/github/issues/MitrofD/tl-react-numeric-input) [![Maintainability](https://api.codeclimate.com/v1/badges/9f201ce717d730bdc6de/maintainability)](https://codeclimate.com/github/MitrophD/tl-react-numeric-input/maintainability) [![npm version](https://badge.fury.io/js/tl-react-numeric-input.svg)](https://badge.fury.io/js/tl-react-numeric-input) [![Open Source Love](https://badges.frapsoft.com/os/mit/mit.svg?v=102)](https://github.com/MitrophD/tl-react-numeric-input) ![David](https://img.shields.io/david/MitrophD/tl-react-numeric-input) ![David](https://img.shields.io/david/dev/MitrophD/tl-react-numeric-input) ![David](https://img.shields.io/david/peer/MitrophD/tl-react-numeric-input)

[![npmjs](https://nodei.co/npm/tl-react-numeric-input.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/tl-react-numeric-input)

## Installation

Use the package manager to install tl-react-numeric-input:

```shell
  yarn add tl-react-numeric-input
  # or
  npm i tl-react-numeric-input
```

## Demo

Download and unzip archive or clone with command:

```shell
  git clone https://github.com/MitrofD/tl-react-numeric-input.git
```

Then install dependencies:

```shell
  yarn i
  # or
  npm i
```

Last step run **start** command:

```shell
  yarn run start
  # or
  npm run start
```

## Usage

```js
  import TLNumericInput from 'tl-react-numeric-input';

  <TLNumericInput onSet={handleOnSet} />
```

Your handler for the onSet event should expect a TLNumericInput. For example:

```js
  function handleOnSet(numericInput) {
    this.setState({
      numeric: numericInput.value
    });
  }
```

## Attributes

All attributes for input with number type + optional **onSet** handler

## License
[MIT](https://choosealicense.com/licenses/mit/)
