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
				var parent = village_data.level3[parentCode] = village_data.level3[parentCode] || [];
				return parent;
			} else {
				console.log('Illeagle code length:', code);
			}
		};
		var isLeaf = function isLeaf(code) {
			return 11 === code.length;
		};
		// 不能用完整樹狀結構，因為不知道為什麼Safari會因此而爆炸慢，只好折衷攤平樹狀結構
		var village_data = {
			level1: [],
			level2: {},
			level3: {},
			total: 0
		};
		$(res).find('Row').each(function(index, el) {
			village_data.total++;
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
	var loadingDeferred;
	var loadVillageData = function loadVillageData(options) {
		if (loadingDeferred) {
			return loadingDeferred.promise();
		}
		loadingDeferred = $.Deferred();
		if (village_data) {
			loadingDeferred.resolve(village_data);
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
					loadingDeferred.resolve(village_data);
				}, 1);
			})
			.fail(function() {
				loadingDeferred.reject.apply(loadingDeferred, arguments);
			});
			
		}
		return loadingDeferred.promise();
	};
	var selfTest = function selfTest(village_data) {
		console.log('start self test date: ', village_data);
		var total = 0;
		var start = window.performance?window.performance.now():0;
		$.each(village_data.level1, function(index, level1Obj) {
			total++;
			var level2Entry = village_data.level2[level1Obj.code]
			if (!level2Entry) {
				console.error('cannot find level2 entry for code', level1Obj.code);
			} else {
				$.each(level2Entry, function(index, level2Obj) {
					total++;
					var level3Entry = village_data.level3[level2Obj.code];
					if (!level3Entry) {
						console.error('cannot find level3 entry for code', level2Obj.code);					 	
					} else {
						total += level3Entry.length;
					}
				});
			}
		});
		if (window.performance) {
			console.log('self test spent: '+(window.performance.now()-start));
		}
		if (total !== village_data.total) {
			console.error('item count are mismatched !', total, village_data.total);
		}
	};
	var _createSelectDivWithOptions = function _createSelectDivWithOptions(options, hint, name, clazz) {
		var container = $('<div/>', {
			class: clazz
		});
		var select = $('<select/>', {name: name}).appendTo(container);
	  $('<option/>', {
	  	disabled: '',
	  	selected: '',
	  	value: '',
	  	text: hint
		}).appendTo(select);
		$.each(options, function(index, option) {
		  $('<option/>', {
		  	value: option.code,
		  	text: option.content
			}).appendTo(select);
		});
		return container;
	};
  $.fn.taiwan_village_picker = function (options) {
  	this.each(function() {
  		var $this = $(this);
  		$.when(loadVillageData(options))
  		.done(function(village_data) {
  			selfTest(village_data);
	  		console.log('taiwan_village_pickerlized', village_data, $this);
	  		$this.empty();
	  		var $level1Selector = _createSelectDivWithOptions(village_data.level1, '請選擇縣市', undefined, options.class);
	  		var $leve2Selector;
	  		var $leve3Selector;
	  		$this.append($level1Selector);
	  		$('<label/>', {text: options.label}).appendTo($level1Selector);
	  		$('select', $level1Selector).change(function(event) {
	  			if ($leve2Selector) {
	  				$leve2Selector.remove();
	  			}
	  			if ($leve3Selector) {
	  				$leve3Selector.remove();
	  			}
	  			$leve2Selector = _createSelectDivWithOptions(village_data.level2[$(this).val()], '請選擇鄉鎮', undefined, options.class);
	  			$this.append($leve2Selector);
	  			$('select', $leve2Selector).material_select();
	  			$('select', $leve2Selector).change(function(event) {
	  				if ($leve3Selector) {
	  					$leve3Selector.remove();
	  				}
	  				$leve3Selector = _createSelectDivWithOptions(village_data.level3[$(this).val()], '請選擇里', options.name, options.class);
	  				$this.append($leve3Selector);
	  				$('select', $leve3Selector).material_select();
	  			});
	  		});
	  		$('select', $this).material_select();
  		})
  		.fail(function() {
  			console.log("error occurred", arguments);
  		});
  		
  	});
  };

})(jQuery);