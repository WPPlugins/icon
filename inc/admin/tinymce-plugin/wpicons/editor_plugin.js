(function() {
	tinymce.create('tinymce.plugins.wpicons', {

		init : function(ed, url) {
			
			var t = this;

			t.url = url;
			
			//replace shortcode before editor content set
			ed.on('BeforeSetcontent', function(event){
				
				event.content = t._do_spot(event.content, t.url);
				
			});
			
			//replace shortcode as its inserted into editor (which uses the exec command)
			ed.on('ExecCommand', function(event){

			    if (event.command ==='mceInsertContent'){
					
					tinyMCE.activeEditor.setContent( t._do_spot(tinyMCE.activeEditor.getContent(), t.url) );
				}
				
			});

			//replace the image back to shortcode on save
			ed.on('PostProcess', function(event){
				
				if (event.get)
					event.content = t._get_spot(event.content);
				
			});

			
			// Handle Icon on Click
				ed.on('Click', function(event){

					if (event.target.className == 'iconsc') {
						
						$ = ed.getWin().parent.jQuery;

						var scAttr = wp.shortcode.next( 'wpicon', '['+event.target.dataset.attr+']' ).shortcode.attrs.named;
						
						var myArray = [];
						
						$('#icon_picker_button').trigger('click');

						setTimeout(function() {
						
							$('#is_edit').attr('value','edit');
							$('#icon_insert_icon').attr('value','Update Icon');
							
							for(var i in scAttr) {
								myArray.push(scAttr[i]);
								}
							
							$('.iconval').each( function(index, item) {
								
								var iscol = ''+myArray[index]+'';
								
								if ( iscol.indexOf('#') != -1 ) {
									$(item).wpColorPicker('color', myArray[index]);
								}

								else if ($(item).is('select')) {
									if ($(item).attr('id') == 'icon_select_icon_source' ) {
										$('option[data-lib="'+myArray[index]+'"]', this).attr("selected","selected").trigger('change');
									} else {
										$('option[value="'+myArray[index]+'"]', this).attr("selected","selected").trigger('change');
										}
								} 
								else {
									$(item).attr('value', myArray[index]);
									}
								
								if ( index == myArray.length) return false;
								
							});	
							
							$('.mce-inline-toolbar-grp').hide();
							
						}, 500);
							
							
							setTimeout(function() {

								if ( myArray[0] == 'fa' ) { prefix = 'fa '; }
								else if ( myArray[0] == 'di' ) { prefix = 'dashicons '; }
								else if ( myArray[0] == 'oi' ) { prefix = 'oi '; }
								else if ( myArray[0] == 'gmi' ) { prefix = 'material-icons '; }
								else if ( myArray[0] == 'pf' ) { prefix = 'pf '; }
								else { prefix = ''; }
								
								$('#icon_list').attr('value', prefix+''+myArray[1]);
								$('.selected-icon').html('<i class="'+prefix+''+myArray[1]+'"></i>');
								
								}, 500);
						
					}
					
        	});
			

		},

		_do_spot : function(co, t) {
			return co.replace(/\[wpicon([^\]]*)\]/g, function(a,b){
				return '<img src="'+t+'/images/t.gif" class="iconsc" data-attr="wpicon'+tinymce.DOM.encode(b)+'" title="CLICK TO EDIT"/>';
			});
		},

		_get_spot : function(co) {

			function getAttr(s, n) {
				n = new RegExp(n + '=\"([^\"]+)\"', 'g').exec(s);
				return n ? tinymce.DOM.decode(n[1]) : '';
			};

			return co.replace(/(?:<p[^>]*>)*(<img[^>]+>)(?:<\/p>)*/g, function(a,im) {
				var cls = getAttr(im, 'class');

				if ( cls.indexOf('iconsc') != -1 )
					return '<p>['+tinymce.trim(getAttr(im, 'data-attr'))+']</p>';

				return a;
			});
		},

		getInfo : function() {
			return {
				longname : 'GhozyLab Icon Lite',
				author : 'GHOZY LAB LLC',
				authorurl : 'https://ghozylab.com/',
				infourl : '',
				version : "1.0"
			};
		}
	});

	tinymce.PluginManager.add('wpicons', tinymce.plugins.wpicons);
})();