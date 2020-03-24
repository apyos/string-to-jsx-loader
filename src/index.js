const parse5 = require('parse5')
const LoaderDependency = require('webpack/lib/dependencies/LoaderDependency')

function parseText(text) {
	return text
		.split(/[{}]/g)
		.map((value, index) =>
			index % 2 === 1 || value === ''
				? value
				: `'${value
						.replace(/'/g, "\\'")
						.replace(/\r/g, '\\r')
						.replace(/\n/g, '\\n')}'`
		)
		.filter((value) => value !== '')
}

function getVariables(nodes) {
	if (!nodes) {
		return []
	}

	return [nodes]
		.flat()
		.map((node) =>
			node.nodeName === '#text'
				? node.value.split(/[{}]/g).filter((_, index) => index % 2 === 1)
				: getVariables(node.childNodes)
		)
		.flat()
}

function compile(text) {
	const fragment = parse5.parseFragment(text)
	const variables = getVariables(fragment)
	const result = fragment.childNodes
		.map((node) =>
			node.nodeName === '#text'
				? parseText(node.value)
				: parse5.serialize({
						nodeName: 'div',
						childNodes: [node],
				  })
		)
		.flat()

	let string = ''
	if (variables.length) {
		string += `({ ${variables.join(',')} }) => `
	}

	string += result.length > 1 ? `[${result.join(',')}]` : result[0]
	return string
}

function compileAll(dictionary) {
	if (typeof dictionary === 'string') {
		return compile(dictionary)
	}

	return `{${Object.entries(dictionary)
		.map(([key, value]) => `${key}: ${compileAll(value)}`)
		.join(',')}}`
}

module.exports = function StringToJsxLoader(source) {
	const requiredType = 'javascript/auto'
	const factory = this._compilation.dependencyFactories.get(LoaderDependency)
	this._module.type = requiredType
	this._module.generator = factory.getGenerator(requiredType)
	this._module.parser = factory.getParser(requiredType)

	const json = JSON.parse(source)
	const compiled = compileAll(json)
	return `module.exports = ${compiled}`
}
