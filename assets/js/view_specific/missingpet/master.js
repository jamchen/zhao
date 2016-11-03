function runMasterJs(options) {
  
  var cardHandlerUrl = '/js/view_specific/cardHtmlTemplate.js';

  var dc = options;
  var offset = options.offset;
  var limit = options.limit;
  var total = options.total;
  var totalPage = Math.ceil(total/10);
  var beginningIdInPage = total - offset;
  moment.locale(navigator.language || navigator.userLanguage);

  //let offset been zero or multiples of ten
  if(offset < 0) {
    offset = 0;
  } else {
    offset = Math.floor(offset / 10) * 10;
  }

  //hide picture when master pictures onload
  hidePicture(beginningIdInPage);
  //trigger toNextPage function when next page button had been clicked
  document.getElementById("pageNext").addEventListener("click", toNextPage);
  //trigger toPreviousPage function when previous page button had been clicked
  document.getElementById("pagePrevious").addEventListener("click", toPreviousPage);

  //hide picture when master pictures onload
  function hidePicture(pictureId) {
    for (var k = pictureId; k > (pictureId - 11); k--) {
      (function(id) {
        $('#master-picture' + id).hide();
        checkImgStatus(id);
      })(k)
    }
  }

  //check if master picture had been loaded, if it had been bloaded, show the picture and hide spinner
  function checkImgStatus(num) {
    $('#master-picture' + num).load(function() {
      $('#master-picture' + num).show();
      $('#loader' + num).removeClass('loader');
    });
  }


  //when pressdown previous page button, change the value of offset and get ajax data (pets informations)
  function toPreviousPage() {
    if($('#pagePrevious').hasClass('disabled') === false) {
      if(Number(offset) <= 0) {
      offset = 0;
      } else {
        offset -= 10;
      }
      getAjax(offset);
    } 
  }


  //when pressdown next page button, change the value of offset and get ajax data (pets informations)
  function toNextPage() {
    if($('#pageNext').hasClass('disabled') === false) {
      if(Number(offset) >= (totalPage * 10) - 10) {
        offset = (totalPage * 10) - 10;
      } else {
        offset += 10;
      }
      getAjax(offset);
    }
  }

  //trigger toPage function when page button had been clicked
  for(var i = 1; i < totalPage +1; i++ ) {
        (function(page) {
            document.getElementById("page" + i).addEventListener("click", function() {
              if(offset !== (page * 10) - 10) {
                toPage(page);
              }
            });
        })(i);
    }

    //set new offset when click page buttons
  function toPage(page) {
    offset = 10 * page - 10;
    getAjax(offset);
  }

  //get AJAX for peges
  function getAjax(offset) {
    var xhttp = getRequestObject();
    var requestUrl = '/missingPet?limit=10&skip=' + offset + '&sort=updatedAt%20DESC';
    xhttp.onreadystatechange = function() {
      if(this.readyState == 4 && this.status == 200) {
        var htmlContent = JSON.parse(this.responseText);
        getCardHandlerTemplate(htmlContent);
        }
      };
    xhttp.open("GET", requestUrl, true);
    xhttp.send(null);
  }

  //get card template
  function getCardHandlerTemplate(htmlContent) {
    var templateContent = getRequestObject();
    templateContent.onreadystatechange = function() {
      if(this.readyState == 4 && this.status == 200) {
        console.log(this.responseText);
        var sorce = this.responseText;
        var template = Handlebars.compile(this.responseText);
        appendNewCardInNewPage(template, htmlContent);        
          paginationClassesForNewPage(offset);
          hidePicture(total - offset);
          $('html, body').scrollTop(0);
      }
    }
    templateContent.open("Get", cardHandlerUrl, true);
    templateContent.send(null);
  }

  function appendNewCardInNewPage(template, htmlContent) {
    for(var i = 0; i < htmlContent.length; i++) {
      if(i === 0) {
        $('#row').html(template(htmlContent[i]));
      } else {
        $("#row").append(template(htmlContent[i]));
      }
    }
  }

  

  //return exchange datatype
  function getRequestObject() {
    if (window.XMLHttpRequest) {
      return (new XMLHttpRequest());
    } 
    else if (window.ActiveXObject) {
      // For very old IE browsers (optional)
      return (new ActiveXObject("Microsoft.XMLHTTP"));
    } 
    else {
      // global.alert("Ajax is not supported!");
      return(null); 
    }
  }

  //function to change classes for fitting new page
  function paginationClassesForNewPage(offset) {

    $('.page').removeClass('disabled');
    $('.page').removeClass('active');
    // if offset <= 0, set previous button to disabled
    if(Number(offset) <= 0) {
      $('#pagePrevious').removeClass('waves-effect');
      $('#pagePrevious').addClass('disabled');
    }
    // active current page button
    $('#page' + Math.floor((offset/10) + 1)).addClass('active');
    //if it is last page, set next button to disabled
    if(Number(offset) === ((totalPage * 10) - 10) || Number(offset) === Number(total)) {
      $('#pageNext').removeClass('waves-effect');
      $('#pageNext').addClass('disabled');
    }
  }



  // Handlebars helper for cards
  // translate gender from EN to ZH-TW 
  Handlebars.registerHelper("genderToChinses", function(gender){
    if(gender == 'male') {
      return '公';
    }
    else if(gender == 'female') {
      return '母';
    }   
  });

  //change moment format. for example: 10/03/2016. it's related to local date format
  Handlebars.registerHelper("localDateFormat", function(date){
    return moment(date).format('L');
  });

  //choose latest updated/created date
  Handlebars.registerHelper("lastUpdatedDate", function(createdAt, updatedAt){
    var mostDistantFuture = moment().max(createdAt, updatedAt);
    return moment(mostDistantFuture).format('L');
  });

  getAjax(offset);
  // function getTemplete(cardHandlerUrl) {
  //  var source = getRequestObject();
  //  source.onreadystatechange = function() {

  //  }
  // }

  // function handleResponse(xhttp,
 //                         cardHandlerUrl) {
  // if((xhttp.readyState == 4) &&
  //   (xhttp.status == 200)) {
  //      var htmlContent = JSON.parse(xhttp.responseText);
  //      $("#row").html(template(htmlContent[0]) + xhttp.responseText);
  //      console.log(xhttp.responseText);
  //        paginationClassesForNewPage(offset);
  //    hidePicture()
  //   }
  // }

  // function handleResponse(request,
 //                        responseHandler,
 //                        isJsonResponse) {
  //  if ((request.readyState == 4) &&
  //     (request.status == 200)) {

  //      // Default to isJsonResponse = true
  //      if (isJsonResponse == undefined) {
  //        isJsonResponse = true;
  //      }

  //      if (isJsonResponse) {
  //        responseHandler(JSON.parse(request.responseText));
  //      }
  //      else {
  //        responseHandler(request.responseText);
  //      }
  //    }
  //  }

  //create new cards by AJAX
  // function createNewCardByAjax(missingPets) {
  //  var cardHtml = '';
  //  for(var j = 0; j < missingPets.length; j++) {
  //    cardHtml += '<div class="col s12 m6">';
  //      cardHtml += '<div class="col m12 s12 card">';
  //        cardHtml += '<a target="_blank" href="/missingPet/detail/' + missingPets[j].id + ' ">';
  //          cardHtml += '<div class="card-image waves-effect waves-block waves-light">';
  //            cardHtml += '<div id="mainPicture' + j + '">';
  //              cardHtml += '<div id="loader' + j + '" class="loader">';
  //              cardHtml += '<img id="master-picture' + j + '" class="activator master-picture" src="' + missingPets[j].mainPictureUrl + '">';
  //              cardHtml += '</div>';
  //            cardHtml += '</div>';
  //            cardHtml += '<span class="card-title activator master-name col s12 grey image-title">';
  //              cardHtml += '名稱：'+ missingPets[j].name;
  //              cardHtml += '<i class="material-icons right">more_vert</i>';
  //            cardHtml += '</span>';
  //          cardHtml += '</div>';
  //        cardHtml += '</a>';

          
  //        cardHtml += '<div class="card-content flow-text">';
  //          cardHtml += '<div class="col s5 column1 truncate">';
  //            cardHtml += '<p class="master-kind">';
  //              cardHtml += '類別：' + missingPets[j].kind;
  //            cardHtml += '</p>';
  //            cardHtml += '<p class="master-breed">';
  //              cardHtml += '品種：' + missingPets[j].breed;
  //            cardHtml += '</p>';
  //            cardHtml += '<p class="master-color">';
  //              cardHtml += '花色：' + missingPets[j].color;
  //            cardHtml += '</p>';
  //            cardHtml += '<p class="master-gender">';
  //              var petGender = missingPets[j].gender
  //              if(petGender == 'male') {
  //                petGender = '公'
  //              } else if(petGender == 'female') {
  //                petGender = '母'
  //              }
  //              cardHtml += '性別：' + petGender;
  //            cardHtml += '</p>';
  //          cardHtml += '</div>';
  //          cardHtml += '<div class="col s7 column2">';
  //            cardHtml += '<p class="master-location truncate">';
  //              cardHtml += '走失地點：' + missingPets[j].location;
  //            cardHtml += '</p>';
  //            cardHtml += '<p class="master-missingDate">';
  //              var date = missingPets[j].missingDate;
  //              cardHtml += '走失日期：' + moment(date).format('L');
  //            cardHtml += '</p>';
  //            cardHtml += '<p class="master-mostDistantFuture">';
  //              var createdDate = missingPets[j].createdAt;
  //              var updatedDate = missingPets[j].updatedAt;
  //              //var mostDistantFuture = moment().max(createdDate, updatedDate);
  //              if (updatedDate !== '' || updatedDate !== null || updatedDate !== undefined) {
  //                var mostDistantFuture = updatedDate;
  //              } else {
  //                var mostDistantFuture = createdDate;
  //              }
  //              cardHtml += '更新日期：' + moment(mostDistantFuture).format('L');
  //            cardHtml += '</p>';
  //          cardHtml += '</div>';
  //        cardHtml += '</div>';
  //      cardHtml += '</div>';
  //    cardHtml += '</div>';
  //  }
  //  // console.log('total = ' + total);
  //  // console.log('offset = ' + offset);
  //  // console.log('limit = ' + limit);
  //  return cardHtml;
  // }

} //end of runMasterJs function