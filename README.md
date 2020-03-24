# string-to-jsx-loader [![npm](https://img.shields.io/npm/v/string-to-jsx-loader.svg?style=flat)](https://npm.im/string-to-jsx-loader) [![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fapyos%2Fstring-to-jsx-loader.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fapyos%2Fstring-to-jsx-loader?ref=badge_shield)

## Install

```
$ npm install -S string-to-jsx-loader
```

## Configuration

webpack.config.js

```
module.exports = {
	module: {
		rules: {
			enforce: 'pre',
			test: /\.json$/,
			include: [resolve(__dirname, 'some/folder')],
			use: [
				{ loader: 'babel-loader' },
				{ loader: 'string-to-jsx-loader' }
			]
		}
	}
}
```

## Example

For example, this can be used as a translation library (see [string-to-jsx-i18n](https://github.com/apyos/string-to-jsx-i18n))

```json
{
	"text": "Hello!",
	"variable": "Hello {name}",
	"buy": "Buy {item} for {money}?",
	"html": "This <b>works</b><i>too</i>!",
	"complexHtml": "You can even <span>{nested} <b>{elements}</b></span>!"
}
```

becomes

```jsx
{
	text: 'Hello!',
	variable: ({ name }) => ['Hello ', name],
	buy: ({ item, money }) => ['Buy ', item, ' for ', money, '?'],
	html: ['This ', <b>works</b>, <i>too</i>, '!'],
	complexHtml: ({ nest,
elements }) => ['You can even ', <span>{nest} <b>{elements}</b></span>, '!']
}
```

which can then simply be used in JSX components:

```jsx
import dictionary from './en.json'

const Translate = ({ id, ...props }) => typeof dictionary[id] === 'function' ? dictionary[id](props) : dictionary[id]
const Item = ({ name }) => (<div style={{ color: 'red' }}>{name}</div>)
const Money = ({ amount }) => (<div style={{ color: 'yellow' }}>${amount}</div>)

<Translate id="buy" item={<Item name="Computer" />} money={<Money amount={2000} />}>
```

## License

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fapyos%2Fstring-to-jsx-loader.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fapyos%2Fstring-to-jsx-loader?ref=badge_large)
