//function(){
function Go(){
	
}
	//$('.master-picture').hide;
	
	function imgOnload(num) {
		$('#loader' + num).removeClass('loader');
		$('.master-picture' + num).show;
	}

	
	var htmlUrl = window.location.href;
	
	if(htmlUrl == 'http://zhaodao.herokuapp.com:1337/missingPet/master' || htmlUrl == 'http://zhaodao.herokuapp.com:1337/missingPet/master#!') {
		$('#page1').addClass('disabled');
		$('#pagePrevious').addClass('disabled');
	}
	


	function buildFirstPagePagination(total) {
		var totalPage = Math.ceil(total/10);
		var offsetJ = totalPage * 10;
		var htmlContent = '';
		if(window.location.href == 'http://zhaodao.herokuapp.com:1337/missingPet/master' || window.location.href == 'http://zhaodao.herokuapp.com:1337/missingPet/master#!') {
			htmlContent += '<li id="pagePrevious" class="disabled"><a href="#!"><i class="material-icons">chevron_left</i></a></li>'
			for(j = 0; j < totalPage; j++) {
				offsetJ -= 10;
				if (j === 0) {
					htmlContent += '<li id="page' + (j+1) + '" class="page waves-effect active"><a href="#!">' + (j+1) + '</a></li>';
				} else {
					htmlContent += '<li id="page' + (j+1) + '" class="page waves-effect"><a href="http://zhaodao.herokuapp.com:1337/missingPet/master?limit=10&offset=' + offsetJ + '%>"><%= j+1 %></a></li>';
				}
			} // end of for loop
			if(totalPage > 1) {
				htmlContent += '<li id="pageNext" class="waves-effect"><a href="http://zhaodao.herokuapp.com:1337/missingPet/master?limit=10&offset=' + ((totalPage * 10) - 10) + '"><i class="material-icons">chevron_right</i></a></li>';
			} else {
				htmlContent += '<li id="pageNext" class="default"><a href="#!"><i class="material-icons">chevron_right</i></a></li>';
			}
			$('.pagination').html(htmlContent);
		} // end of if  
	};


	
//}

