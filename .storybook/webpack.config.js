module.exports = ({ config }) => {
    config.module.rules.push({
        test: /\.(ts|tsx)$/,
        loader: 'awesome-typescript-loader',
    })

    config.resolve.extensions.unshift('.ts', '.tsx')

    return config
}
