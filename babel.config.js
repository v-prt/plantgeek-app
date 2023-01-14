module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env', // alias to make importing a little easier
          path: '.env',
        },
      ],
    ],
  }
}
