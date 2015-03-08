$(function() {

	var User = {
	    handle: '@kdragos',
	    img: "images/kristin.png"
	}


	// Opens and closes the compose a tweet section.
	$(document).on('click', 'textarea', function(){
		$(this).parents('.compose').toggleClass('expand');
	});

	// Expands and collapses the tweets and replies in the thread. 
	$(document).on('click', '.tweet', function(){
		$(this).parents('.thread').toggleClass('expand');
	});


	// Determines which form is being submitted, creates and fills the template.
	$(document).on('submit', 'form', function(event){
		event.preventDefault();
		var message = $(this).find('textarea').val();
		if($(this).is('header > form')) {  // !! Split these into two functions. !!
			$(".tweets").prepend(makeThread(User.handle, message, User.img));
			$(this).find('textarea').val('');
		} else {
			$(this).parents('.replies').append(makeTweet(User.handle, message, User.img));
			$(this).find('textarea').val('');
		}
	});




	// Template creation variables.
	var makeTweet = function renderTweet(User, message, image) {
		var source   = $("#template-tweet").html();
		var template = Handlebars.compile(source);
		var context = {User: User, message: message, image: image};
		var tweet    = template(context);
		return tweet;
	}

	var makeForm = function renderCompose() {
		var source   = $("#template-compose").html();
		var template = Handlebars.compile(source);
		var context = {};
		var html    = template(context);
		return html;
	}

	var makeThread = function renderThread(User, message, image) {
		var source   = $("#template-thread").html();
		var template = Handlebars.compile(source);
		var context = {
			'tweet': makeTweet(User, message, image),
			'compose': makeForm()
		};
		var thread = template(context);
		return thread;
	}

	// Template Functions -- This was for the partial templates. {{> template}}
	// Handlebars.registerPartial("template-tweet", $("#template-tweet").html());
	// Handlebars.registerPartial("template-compose", $("#template-compose").html());

});