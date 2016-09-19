document.addEventListener("DOMContentLoaded",  function() {
	
	var dc = $dc
	var offset = dc.offset;
	var limit = dc.limit;
	var total = dc.total;
	var totalPage = Math.ceil(total/10);

	moment.locale(navigator.language || navigator.userLanguage);

	if(offset < 0) {
		offset = 0;
	} else {
		offset = Math.floor(offset / 10) * 10;
	}

	//function for hide spinner when img onload	
	hideSpinner();

	function hideSpinner() {
		for (var k = 0; k < 10; k++) {
			$('#master-picture' + k).hide();
			checkImgStatus(k);
		}
	}

	function checkImgStatus(num) {
		$('#master-picture' + num).load(function() {
			$('#master-picture' + num).show();
			$('#loader' + num).removeClass('loader');
		});
	}

	
	
	//function when click event has triggered by previous button
	document.getElementById("pagePrevious").addEventListener("click", toPreviousPage);
	
	function toPreviousPage() {
		if($('#pagePrevious').hasClass('disabled') === false) {
			if(Number(offset) <= 0) {
			offset = 0;
			} else {
				offset -= 10;
			}
			getAjax(offset);
			console.log('offsetPre = ' + offset);
		}	
	}

	//function when click event has triggered by next button
	document.getElementById("pageNext").addEventListener("click", toNextPage);

	function toNextPage() {
		if($('#pageNext').hasClass('disabled') === false) {
			if(Number(offset) >= (totalPage * 10) - 10) {
				offset = (totalPage * 10) - 10;
			} else {
				offset += 10;
			}
			getAjax(offset);
			console.log('offsetNext = ' + offset);
		}
	}

	//function when click event has triggered by page buttons
	for(var i = 1; i < totalPage +1; i++ ) {
        (function(page) {
            document.getElementById("page" + i).addEventListener("click", function() {
            	if(offset !== (page * 10) - 10) {
            		toPage(page);
            	}
            });
        })(i);
    }

	function toPage(page) {
		offset = 10 * page - 10;
		getAjax(offset);
	}

	//get AJAX for peges
	function getAjax(offset) {
		var xhttp = new XMLHttpRequest();
		var requestUrl = '/missingPet?limit=10&skip=' + offset + '&sort=updatedAt%20DESC';
		xhttp.onreadystatechange = function() {
			if(this.readyState == 4 && this.status == 200) {
  				document.getElementById("row").innerHTML = createNewCardByAjax(JSON.parse(this.responseText));
  				paginationClassesForNewPage(offset);
  				hideSpinner();
				}
			};
			xhttp.open("GET", requestUrl, true);
			xhttp.send();
	}


	//create new cards by AJAX
	function createNewCardByAjax(missingPets) {
		var cardHtml = '';
		for(var j = 0; j < missingPets.length; j++) {
			cardHtml += '<div class="col s12 m6">';
				cardHtml += '<div class="col m12 s12 card">';
					cardHtml += '<a target="_blank" href="/missingPet/detail/' + missingPets[j].id + ' ">';
						cardHtml += '<div class="card-image waves-effect waves-block waves-light">';
							cardHtml += '<div id="mainPicture' + j + '">';
								cardHtml += '<div id="loader' + j + '" class="loader">';
							 	cardHtml += '<img id="master-picture' + j + '" class="activator master-picture" src="' + missingPets[j].mainPictureUrl + '">';
							 	cardHtml += '</div>';
							cardHtml += '</div>';
							cardHtml += '<span class="card-title activator master-name col s12 grey image-title">';
								cardHtml += '名稱：'+ missingPets[j].name;
								cardHtml += '<i class="material-icons right">more_vert</i>';
							cardHtml += '</span>';
						cardHtml += '</div>';
					cardHtml += '</a>';

					
					cardHtml += '<div class="card-content flow-text">';
						cardHtml += '<div class="col s5 column1 truncate">';
							cardHtml += '<p class="master-kind">';
								cardHtml += '類別：' + missingPets[j].kind;
							cardHtml += '</p>';
							cardHtml += '<p class="master-breed">';
								cardHtml += '品種：' + missingPets[j].breed;
							cardHtml += '</p>';
							cardHtml += '<p class="master-color">';
								cardHtml += '花色：' + missingPets[j].color;
							cardHtml += '</p>';
							cardHtml += '<p class="master-gender">';
								var petGender = missingPets[j].gender
								if(petGender == 'male') {
									petGender = '公'
								} else if(petGender == 'female') {
									petGender = '母'
								}
								cardHtml += '性別：' + petGender;
							cardHtml += '</p>';
						cardHtml += '</div>';
						cardHtml += '<div class="col s7 column2">';
							cardHtml += '<p class="master-location truncate">';
								cardHtml += '走失地點：' + missingPets[j].location;
							cardHtml += '</p>';
							cardHtml += '<p class="master-missingDate">';
								var date = missingPets[j].missingDate;
								cardHtml += '走失日期：' + moment(date).format('L');
							cardHtml += '</p>';
							cardHtml += '<p class="master-mostDistantFuture">';
								var createdDate = missingPets[j].createdAt;
								var updatedDate = missingPets[j].updatedAt;
								//var mostDistantFuture = moment().max(createdDate, updatedDate);
								if (updatedDate !== '' || updatedDate !== null || updatedDate !== undefined) {
									var mostDistantFuture = updatedDate;
								} else {
									var mostDistantFuture = createdDate;
								}
								cardHtml += '更新日期：' + moment(mostDistantFuture).format('L');
							cardHtml += '</p>';
						cardHtml += '</div>';
					cardHtml += '</div>';
				cardHtml += '</div>';
			cardHtml += '</div>';
		}
		// console.log('total = ' + total);
		// console.log('offset = ' + offset);
		// console.log('limit = ' + limit);
		return cardHtml
	}

	

	//function to change classes to fit new page
	function paginationClassesForNewPage(offset) {

		$('.page').removeClass('disabled');
		$('.page').removeClass('active');

		if(Number(offset) <= 0) {
			$('#pagePrevious').removeClass('waves-effect');
			$('#pagePrevious').addClass('disabled');
		}

		$('#page' + Math.floor((offset/10) + 1)).addClass('active');
		
		if(Number(offset) === ((totalPage * 10) - 10) || Number(offset) === Number(total)) {
			$('#pageNext').removeClass('waves-effect');
			$('#pageNext').addClass('disabled');
		}
	}

}); //end of DOMcontentLoaded event