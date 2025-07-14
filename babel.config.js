module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // Add this plugins array
    plugins: [
      ['@babel/plugin-transform-private-methods', { 'loose': true }]
    ]
  };
};