/*!
 * Taiwan Village Picker
 * Copyright 2016 Jam Chen
 * MIT License (https://raw.githubusercontent.com/Dogfalo/materialize/master/LICENSE)
 */
// Check for jQuery.
if (typeof(jQuery) === 'undefined') {
  var jQuery;
  // Check if require is a defined function.
  if (typeof(require) === 'function') {
    jQuery = $ = require('jquery');
  // Else use the dollar sign alias.
  } else if ($) {
    jQuery = $;
  }
}


;(function ($) {

	var village_data;
	var parseResponse = function parseResponse(res) {
		// 直轄市採兩碼，直轄市所屬之區採五碼，村里採三碼；
		// 縣轄市採五碼，縣轄市所屬之市、鎮、鄉及區採兩碼，村里採三碼，
		// 名稱及代碼順序依內政部提供者為準
		//
		// 歸納:
		// - level 1: 兩碼或五碼
		// - level 2: 共七碼
		// - level 3: 共十碼（包含'-'共十一個字元）
		var findParentForCode = function findParentForCode(village_data, code) {
			if (2 === code.length || 5 === code.length) {
				return village_data;
			}
			var parentNode = village_data[code.substring(0, 2)] || village_data[code.substring(0, 5)];
			if (7 === code.length) {
				return parentNode?parentNode.children:parentNode;
			} else if (11 === code.length) {
				parentNode = parentNode.children[code.substring(0, 7)];
				return parentNode?parentNode.children:parentNode;
			} else {
				console.log('Illeagle code length:', code);
			}
		};
		var isLeaf = function(code) {
			return 11 === code.length;
		};
		var village_data = {};
		var lastIndex;
		$(res).find('Row').each(function(index, el) {
			var $el = $(el);
			var code = $el.find('Code').text().trim();
			var content = $el.find('Content').text().trim();
			var parentNode = findParentForCode(village_data, code);
			if (parentNode) {
				parentNode[code] = {
					code: code, 
					content: content, 
					children: isLeaf(code)?undefined:{}
				};
			} else {
				console.log('error: find no parent node for ', code, content);
			}
			lastIndex = index;
		});
		console.log('total row:', lastIndex+1);
		return village_data;
	}
	var loadVillageData = function loadVillageData(options) {
		var dfd = $.Deferred();
		if (village_data) {
			dfd.resolve(village_data);
		} else {
			$.ajax({
				url: '/raw/village.xml',
				dataType: 'xml'
			})
			.done(function(res) {
				console.log("success", res);
				console.log("parsing xml");
				village_data = parseResponse(res);
				dfd.resolve(village_data);
			})
			.fail(function() {
				dfd.reject.apply(dfd, arguments);
			});
			
		}
		return dfd.promise();
	};

  $.fn.taiwan_village_picker = function (options) {
  	this.each(function() {
  		var $this = $(this);
  		$.when(loadVillageData(options))
  		.done(function(village_data) {
	  		console.log('taiwan_village_pickerlized', village_data, $this);
  		})
  		.fail(function() {
  			console.log("error occurred", arguments);
  		});
  		
  	});
  };

})(jQuery);