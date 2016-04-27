/**
 * Production environment settings
 *
 * This file can include shared settings for a production environment,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

var modelsConnection = 'localMongodbServer';
if (process.env.MONGODB_URI) {
  modelsConnection = 'herokuMongodbServer';
}

module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the production        *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  models: {
    connection: modelsConnection
  },

  /***************************************************************************
   * Set the port in the production environment to 80                        *
   ***************************************************************************/

  port: process.env.PORT || 80,

  /***************************************************************************
   * Set the log level in production environment to "silent"                 *
   ***************************************************************************/

  // log: {
  //   level: "silent"
  // }

  session: {
    adapter: 'connect-mongo',
    url: process.env.MONGODB_URI || 'mongodb://localhost:27017/zhao',
    collection: 'sessions',
    auto_reconnect: false,
    ssl: false,
    stringify: true   
  },
  /*
  set heroku env var like heroku config:set HEROKU_URL=https://sheltered-ridge.herokuapp.com/
  */
  explicitHost: process.env.HEROKU_URL || 'www.zhao.com',

  passport: {
    facebook: {
      options: {
        clientID: process.env.FB_CLIENT_ID,
        clientSecret: process.env.FB_CLIENT_SECRET,
      }
    }
  }
};
