// JavaScript Document

jQuery(document).ready(function($) {

	$('.toggle-button').click(function() {
		$('.toggle-wrapper').slideToggle('fast');
	});

	$('.accept-button').click(function() {
		$(this).toggleClass('accepted');
		$('.waiting-for-accept').toggleClass('accepted');
	});

	$('.popup-call').colorbox({inline:true, width:"25%", closeButton:false});
	$('.close-btn').click(function() {
		$.colorbox.close();
	});

	$(document).on("click", '.collapse-head', function() {
	// $('.collapse-head').click(function() {
		$(this).next('.collapse-body').slideToggle('fast');
		$(this).toggleClass('collapsed');
	});

	$('.online-chat').click(function() {
		$(this).toggleClass('active');
	});

	// $(document).on("click", ".-loanregister", function() {
	// 	if ($(this).text() == 'สนใจสมัคร')
 //       $(this).text('เลือกแล้ว')
 //    else
 //       $(this).text('สนใจสมัคร');
	// });

	$(document).on("click", ".-loandetail", function() {
		$(this).parent('.button').siblings('.expand-info').toggleClass('show');
		if ($(this).text() == 'แสดงรายละเอียด')
       $(this).text('ซ่อนรายละเอียด')
    else
       $(this).text('แสดงรายละเอียด');
	});
	
	$(document).on("click", ".-loandetailsub", function() {
				$(this).siblings().removeClass("selected");
                $(this).addClass('selected');
	});

	$(document).on("click", ".-loaninterest", function() {
				$(this).toggleClass("selected");
	});

	$(document).on("click", ".-clientdetail", function() {
		$(this).parent('.button').siblings('.client-expand-info').toggleClass('show');
	});

	// var $load = $('<div class="loading">Loading...</div>').appendTo('body')
 //    var db = new Firebase('url/data')

	// 	db.on('value', function () {
	// 	  $load.hide()
	// 	})
});
