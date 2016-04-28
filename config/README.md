# local.js example

```
module.exports = {
	passport: {
		facebook: {
			options: {
				clientID: 'YOUR_FB_APP_ID',
				clientSecret: 'YOUR_FB_APP_SECRET'
			}
		}
	},
	models: {
		connection: 'localDiskDb',
		migrate: "alter"
	},
	explicitHost: 'zhaodao.herokuapp.com',
	port: 1337,
	proxyHost: 'zhaodao.herokuapp.com',
	proxyPort: 1337,
	session: {
		adapter: 'memory'
	}
};
```