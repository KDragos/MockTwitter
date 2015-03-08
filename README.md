# Mock Twitter
Create a mock version of twitter given the project's existing HTML/CSS

## HTML Structure
The project is broken down into two main sections: `header` and `.tweets`
```html
<main>
	<header>...</header>
	<div class="tweets">...</div>
</main>
```
The header will only consists of the compose form at all times:
```html
<header>
	<form class="compose">
		<textarea placeholder="Compose new Tweet..."></textarea>
		<div>
			<span class="count">140</span>
			<button>Send</button>
		</div>
	</form>
</header>
```
The `.tweets` section will have it's direct childred elements be `.thread`s. Some are already made for you so you can see the structure. Others will be created dynamically:
```html
<div class="tweets">
	<div class="thread">...</div>
	<div class="thread">...</div>
</div>
```
A new thread will be dynamically created each time someone uses the `.compose` section in the `header`. A `.thread` has the following structure when a new tweet is created:
```html
<div class="thread">

	<div class="tweet">
		<img src="images/rockit.png">
		<div class="body">
			<div class="title">@ROCKIT_BOOTCAMP</div>
			<div class="message">tweet tweet!!</div>
		</div>
	</div>

	<div class="replies">
		
		<form class="compose">
			<textarea placeholder="Compose new Tweet..."></textarea>
			<div>
				<span class="count">140</span>
				<button>Send</button>
			</div>
		</form>

	</div>

</div>
```
Notice how the thread comes with a `.replies` section which will have it's own `.compose`. Also notice that this `.compose` HTML is exactly the same as the one in the `header`.

When a reply `.tweet` is added it will be placed as a sibling to the `.compose` section. Also note that all `.tweet`s will have the exact same HTML whether they are original tweets or replies:

```html
<div class="thread">

	<div class="tweet">
		<img src="images/rockit.png">
		<div class="body">
			<div class="title">@ROCKIT_BOOTCAMP</div>
			<div class="message">tweet tweet!!</div>
		</div>
	</div>

	<div class="replies">
		
		<form class="compose">
			<textarea placeholder="Compose new Tweet..."></textarea>
			<div>
				<span class="count">140</span>
				<button>Send</button>
			</div>
		</form>
		
		<!-- Notice here is our reply -->
		<div class="tweet">
			<img src="images/rockit.png">
			<div class="body">
				<div class="title">@ROCKIT_BOOTCAMP</div>
				<div class="message">tweet tweet!!</div>
			</div>
		</div>

	</div>

</div>
```

## State Management
Be sure to study the CSS and see how it works. There are two parts to this site that use class names for state management. The first is the `.compose` section. By Default, the `.compose` section hides the div which contains the count and send button. The `textarea` is also smaller by default. When the `textarea` is clicked you will need to add a class `.expand` to the `.compose` section as follows:
```html
<form class="compose expand">
	<textarea placeholder="Compose new Tweet..."></textarea>
	<div>
		<span class="count">140</span>
		<button>Send</button>
	</div>
</form>
```
The presense of `.expand` is a state change and the CSS will change the `.compose` to allow the `div` to be shown. It will also change the height of the `textarea`. JavaScript is responsible for behavior, so JS will determine when a state needs to be changed with events (like clicks) but it will only add/remove this class. CSS is responsible for what that state looks like.

The second state we will manage is when an original tweet gets clicked (not a reply tweet). When this happens we will toggle the respective `.thread`'s visibility. Similarly to the compose section mentioned earlier, we will use an `.expand` to be added to the `.thread`. Just keep in mind that this `.expand` has nothing to do with the other one. We're just using similar class names to do similar concepts. Again study the CSS to see how this is done.

# Guide
You will only need 6 functions for this project: three event handlers (each with it's anonymous function) and three template functions. Follow this guide to ensure success:

## 1. User Object
Create a `User` object to hold your twitter handle and your image name. We will use this when we compose tweets.
```js
var User = {
	handle: '@bradwestfall',
	img: 'brad.png'
}
```

## 2. State Management
Since some threads are alread provided for you in the initial HTML, the first thing you should do is create the aforementioned state managment. This should take care of 2 out of the 6 functions we just mentioned. It's important to implement state management early so we can see the moving parts even though nothing dynamic is being created yet.

## 3. Templating
Since there will be a lot of reusable HTML to this project, you will be using HandlebarsJs to break the reusable HTML into templates. Try to think of how many use-cases we're going to need to make the HTML for `.tweet`. There are actually two different use-cases when we need to. The first is when we compose a new thread, and the second is when we reply. These are different because in the case of a new thread we will need the HTML for `.tweet` to be inside the HTML for `.thread`. But for a reply we just need the HTML for `.tweet`. With this in mide, a mistake would be to repeat the `.tweet` HTML twice in two templates:

- A *tweet* template that has all the parts of a tweet
- A *thread* template that has all the parts of a thread and all the parts of a tweet

This would be a mistake because the HTML for a tweet would exist twice. Since templates are supposed to be filled with variables, lets do this instead:

- A *tweet* template that has all the parts of a tweet (same as before)
- A *thread* template that has all the parts of a thread and a variable to insert the tweet that we get from the *tweet* template

In other words, remember to keep your templates DRY.

```html
<script id="template-tweet" type="text/x-handlebars-template">
	...
</script>

<script id="template-compose" type="text/x-handlebars-template">
	...
</script>

<script id="template-thread" type="text/x-handlebars-template">
	...
</script>
```

We will create three template functions where each one will represent it's respective template. Name your functions as follows:
- `renderTweet(User, message)`
- `renderCompose()`
- `renderThread(User, message)`

Each of these templates will return a string. The string will be the respective template to the functions name. Build the functions in the order above and test them out by console logging their results. You can always pass fake data in to test.

The `renderTweet()` and `renderCompose()` functions are pretty strait forward. They simply use Handlebars to return the template as a string. The `renderThread()` function though takes some more thought. It will need to call off to the other two render functions to get their contents, then it will take those "sub templates" and build them into the thread template. Even though `renderThread()` won't use the `User` and `message` values directly, it will need to pass those along to the `renderTweet()`.

## 4. Composition
So far you should have 5/6 functions made. Two for state management and three templating functions that you have already tested out. Now it's time to put it all together and compose some new tweets!

This last event handler funciton will be based on when the user clicks the "Send" button. Here is a breakdown of what this function should do:
> I recommend doing each of these steps one at a time and test them often in the browser to make sure they work

- Cancel the form submission. Since our submit button is inside a form, we don't want the form to actually submit to the form's action do we?
- Get the `message` the user typed into a variable
- Determine what type of compose we are doing. You can do this based on the context (position) of the `.compose` section. Are we in the header? Are we in a thread?
 - Call the appropriate template function based our context and get the response (the new HTML to be inserted)
 - Add the HTML response to the correct place in the DOM
- Clear the `textarea` box so it has no value, and change the state of the `.compose` section so it's not expanded anymore.

# Extra Credit
When composing, get the 140 characters to count down similar to how twitter.com does. We'll let you take it from here. Good luck!
