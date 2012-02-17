(function($) {

	// "GLOBALS"
	var win          = $(window),
		  body         = $("body"),

		  boxes        = $(".boxes"),
      boxHTML      = $(".box-html"),
      boxCSS       = $(".box-css"),
      boxJS        = $(".box-js"),
      boxResult    = $(".result"),

      topBoxesCon  = $(".top-boxes"),
      topBoxes     = $(".box-html, .box-css, .box-js"),

      handle1      = $("#handle-1"),
      handle2      = $("#handle-2"),
      handle3      = $("#handle-3");

      // Initialize the data backing object
  	  TBData.init();
  	
    // Opening and closing settings panels
    $(".settings-nub").on("click", function(e) {
        e.preventDefault();
        $(this)
            .toggleClass("open")
            .parent()
            .parent()
            .find(".settings")
            .toggleClass("open");
    });
  
    closeExpandedAreas = function() {
        $.each($(".expander"), function(index, el) {
            body.toggleClass("focus");
            
            $(this)
                .parent()
                .parent()
                .removeClass('expanded');
        });
    }

    $(".expander").on("click", function(e) {
        e.preventDefault();
        body.toggleClass("focus");
        
        $(this)
            .parent()
            .parent()
            .toggleClass("expanded");
  });

  $("#app-settings-panel").position({
    "my": "right top",
    "at": "right bottom",
    "of": "#app-settings",
    "offset": "5px -1px"
  }).hide(); // to do, adjust position after window size change

  // Opening and closing app settings
  $("#app-settings").on("click", function(e) {
    e.preventDefault();
    $("#app-settings-panel").toggle();
  });

  // select current theme
  $('#theme').val(TBData.theme);
  // show a specific theme
  body.attr("data-theme", TBData.theme);
  
  $("#save-template").on('click', function() {
     // alextodo, save as template to user settings
     // will you need anything else beyond that? will u have to give ur template a name?
     // will it be an overlay, where will the user select an existing template 
     $("#app-settings-panel").toggle();
  });

	// Resize all boxes when window resized
	// TO DO: Debounce? 
  win.resize(function() {
		var space = body.height() - 100; // TO DO: Make less ghetto (problems with floats)
		topBoxesCon.height(space / 2);
		boxResult.height(space / 2);
  }).trigger("resize");

	// Sync UI with data values
	$('#slug').val(TBData.name);
	$('#html').html(TBData.html);
	$('#css').html(TBData.css);
	$('#js').html(TBData.js);
	
	// Sync preprocessors with correct data
	$('input[name="html-preprocessor"]').each(function(index, input) {
	    input.checked = (TBData.htmlPreProcessor == input.value) ? true : false;
	});
	
    $('input[name="css-preprocessor"]').each(function(index, input) {
    	input.checked = (TBData.cssPreProcessor == input.value) ? true : false;
    });

    $('input[name="js-preprocessor"]').each(function(index, input) {
    	input.checked = (TBData.jsPreProcessor == input.value) ? true : false;
    });
    
    // Sync library with correct data as well
    $('#js-select').val(TBData.jsLibrary);
    
    // Better select box for chosing JS library
    $("#js-select, #theme").chosen();

	if(TBData.cssPreFixFree != '') $('#prefix-free').prop('checked', true);

	codeChanged = function(editor, changes, forceCompile) {
		TBData.setEditorValue(editor.getOption('mode'), editor.getValue());
		CodeRenderer.codeChanged(forceCompile);
	}

	// 
	// INITIALIZE EDITORS
	//
	var HTMLeditor = CodeMirror.fromTextArea(document.getElementById("html"), {
	    lineNumbers  : false,
	    value        : TBData.html,
	    mode         : "xml",
	    tabSize      : 2,
	    onChange     : this.codeChanged
	});

	var CSSeditor = CodeMirror.fromTextArea(document.getElementById("css"), {
	    lineNumbers  : false,
	    value        : TBData.css,
	    mode         : "css",
	    tabSize      : 2,
	    onChange     : this.codeChanged
	});

	var JSeditor = CodeMirror.fromTextArea(document.getElementById("js"), {
	    lineNumbers  : false,
	    value        : TBData.js,
	    mode         : "javascript",
	    tabSize      : 2,
	    onChange     : this.codeChanged
	});
	 
	// Initialize the CodeRenderer
  CodeRenderer.init();

  // Bind events
  
  $('#run').on('click', function() {
      CodeRenderer.codeChanged(true);
  });
  
    // HTML related
    $('input[name="html-preprocessor"]').on('click', function() {
  	    TBData.setHTMLOption('preprocessor', this.value);
  	    CodeRenderer.clearCache('html');
  	    
  	    codeChanged(HTMLeditor, '', true);
    });

    // CSS related
    $('input[name="css-preprocessor"]').on('click', function() {
  	    TBData.setCSSOption('preprocessor', this.value);
  	    CodeRenderer.clearCache('css');
  	    codeChanged(CSSeditor, '', true);
    });

    // prefix free checkbox
    $('#prefix-free').on('click', function() {
        TBData.setPrefixFree($(this).is(":checked"));
    });

    // JS related
    $('input[name="js-preprocessor"]').on('click', function() {
  	    TBData.setJSOption('preprocessor', this.value);
  	    CodeRenderer.clearCache('js');
  	    codeChanged(JSeditor, '', true);
    });
    
    $('#js-select').on('change', function(index, select) {
        TBData.setJSLibrary(this.value);
    });
    
    $('#theme').on('change', function(index, select) {
        TBData.setTheme(this.value);
        // Update current theme
        body.attr("data-theme", this.value);
    });

    // Bind keys
    KeyBindings.init(HTMLeditor, CSSeditor, JSeditor);

})(jQuery);