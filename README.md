# zhao

a [Sails](http://sailsjs.org) application


# Instructions:

1. Install Sails - [Official Document](http://sailsjs.org/get-started)

	Example:
	
	```
	sudo npm -g install sails
	```

1. Install Ruby and SASS compiler

	Example:
	
	```
	gem install sass
	```
	
1. Change to project directory

	```
	cd zhao/
	```

1. Install Dependencies (like every nodejs app)

	```
	npm install
	```
	
1. Let's Lift Sails

	```
	sails lift
	```

# MISC.

### 開發環境設定

### Sails開發環境設置檔
開發環境需要簡單的設定，其中包含資料庫，Facebook App Key/Secret，網域等等資訊。

利用Sails的環境設定機制，我們可以產生一個本地開發用的設定於 config/local.js

簡易檔案範例請參考：[https://github.com/jamchen/zhao/blob/develop/config/README.md](https://github.com/jamchen/zhao/blob/develop/config/README.md)

### 網域設定
由於這個專案直接用到Facebook登入(Authentication)，加上Facebook API的控管需要註冊特定網域。

所以開發者在本機開發時需要設定好網域才能成功呼叫Facebook API。

設定網域的其中一個方法是改hosts檔 ([https://en.wikipedia.org/wiki/Hosts_(file)](https://en.wikipedia.org/wiki/Hosts_(file)))
。hosts file 每個平台作法跟路徑各有不同，請參考上列wiki連結。

Mac OS X /etc/hosts 範例：

	##
	# Host Database
	#
	# localhost is used to configure the loopback interface
	# when the system is booting.  Do not change this entry.
	##

	127.0.0.1	localhost
	255.255.255.255	broadcasthost
	
	#127.0.0.1    zhaodao.herokuapp.com
	
	::1             localhost 
	fe80::1%lo0	localhost


**注意：hosts 檔內的網域需要跟config/local.js一致**
