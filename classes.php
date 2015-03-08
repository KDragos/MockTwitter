$(function() {

var User = {
    handle: '@kdragos',
    img: '/images/brad.png'
}

$('.compose textarea').on('focus', 'textarea', function() {
	$(this).parents('.compose').addClass('.expand')
})




});