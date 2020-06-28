module.exports = {
  plugins: ['@babel/plugin-proposal-optional-chaining'],
  presets: [
    [
      '@vue/cli-plugin-babel/preset',
      {
        useBuiltIns: 'entry'
      }
    ]
  ],
  env: {
    test: {
      presets: [
        [
          '@vue/cli-plugin-babel/preset',
          {
            targets: {
              node: 'current'
            }
          }
        ]
      ]
    }
  }
}
