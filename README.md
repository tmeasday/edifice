Edifice
=======

Edifice.js is a rails gem / javascript library for integrating your JS + CSS more closely with your rails workflow. 

Page Specific CSS
-----------------

Add this to your body tag:

    <body class="<%= edifice_body_classes %>">

And you are now free to namespace your CSS like so:

    .c_users.v_show h1 {
      background-color: red;
    }

Of course this namespacing works best with a CSS-preprocessor like [SCSS](http://sass-lang.com/):

    .c_users.v_show {
      h1 {
        background-color: red;
      }
      p {
        margin-bottom: 20px;
      }
    }

The `c_` part will be set to the path of, and the `v_` part to the name of the view that has been rendered by rails. We also set `l_NAME` to the name of the layout rendered, so you can write layout specific CSS with ease.

Page Specific Javascript
------------------------

For a simple way to write page specific javascript, include edifice in your `application.js`:

    /*
     *= require edifice
     */

Include the edifice meta tags in your header:

    <head>
      <%= edifice_meta_tags %>
    </head>

Edifice expects you to create a simple JS object that will be called when you page loads (either directly or via AJAX/[PJAX](https://github.com/defunkt/jquery-pjax)), like so:

    window.usersShow = {
      onReady = function() {
        alert("The users#show page has reached the DomContentLoaded state");
      }
    }

Alternatively you could define `onLoad` (which fires on `window.load`), or nothing at all, if you like. We're easy.


License
-------

Edifice is crafted by [Percolate Studio](http://percolatestudio.com) and released under the [MIT license](www.opensource.org/licenses/MIT)
