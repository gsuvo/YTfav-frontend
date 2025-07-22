const webpack = require('webpack');
const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  plugins: [
    new webpack.EnvironmentPlugin({
      RECAPTCHA_SITE_KEY: '',
      YOUTUBE_API_KEY: ''
    })
  ]
};
