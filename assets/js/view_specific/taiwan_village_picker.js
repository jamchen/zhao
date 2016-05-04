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
		var getParentCode = function getParentCode(parents, code) {
			var parent = $.grep(parents, function(parent) {
					return parent.code === code.substring(0, 2) || parent.code === code.substring(0, 5);
			});
			if (parent.length === 1) {
				return parent[0].code;
			} else {
				console.log('cannot find parent for code', code, ' in ', parents);
			}
		};
		var findParentForCode = function findParentForCode(village_data, code) {
			if (!code) return;
			if (2 === code.length || 5 === code.length) {
				return village_data.level1;
			}
			if (7 === code.length) {
				var parentCode = getParentCode(village_data.level1, code);
				var parent = village_data.level2[parentCode] = village_data.level2[parentCode] || [];
				return parent;
			} else if (11 === code.length) {
				var parentCode = code.substring(0, 7);
				var parent = village_data.level3[parentCode] = village_data.level2[parentCode] || [];
				return parent;
			} else {
				console.log('Illeagle code length:', code);
			}
		};
		var isLeaf = function isLeaf(code) {
			return 11 === code.length;
		};
		var getCodeAndContentFromRow = function getCodeAndContentFromRow(row) {
			var codeAndContent = {};
			for (var i = 0; i < row.childElementCount; i++) {
				var child = row.childNodes[i];
				if ('Code' === child.tagName) {
					codeAndContent.code = child.textContent.trim();
				} else if ('Content' === child.tagName) {
					codeAndContent.content = child.textContent.trim();
				}
			}
			return codeAndContent;
		};
		// 不能用完整樹狀結構，因為不知道為什麼Safari會因此而爆炸慢，只好折衷攤平樹狀結構
		var village_data = {
			level1: [],
			level2: {},
			level3: {}
		};
		$(res).find('Row').each(function(index, el) {
			var $el = $(el);
			var code = $el.find('Code').text().trim();
			var content = $el.find('Content').text().trim();
			var parentNode = findParentForCode(village_data, code);
			if (parentNode) {
				parentNode.push({
					code: code,
					content: content
				});
			} else {
				console.log('error: find no parent node for ', codeAndContent);
			}			
		});
		return village_data;
	}
	var loadVillageData = function loadVillageData(options) {
		var dfd = $.Deferred();
		if (village_data) {
			dfd.resolve(village_data);
		} else {
			$.ajax({
				url: 'http://www.dgbas.gov.tw/public/data/open/stat/village.xml', //'/raw/village.xml',
				dataType: 'xml'
			})
			.done(function(res) {
				console.log("parsing xml");
				var start = window.performance?window.performance.now():0;
				window.setTimeout(function() {
					village_data = parseResponse(res);
					if (window.performance) {
						console.log('parsing spent: '+(window.performance.now()-start));
					}
					dfd.resolve(village_data);
				}, 1);
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