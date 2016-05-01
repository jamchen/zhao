$( document ).ready(function() {
	$(".button-collapse").sideNav();
	$('select').material_select();
	$('.datepicker').pickadate({
	    selectMonths: true, // Creates a dropdown to control month
	});
	$('.materialboxed').materialbox();
})