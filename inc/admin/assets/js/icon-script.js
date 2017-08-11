jQuery(document).ready(function($) {

	var icon_list;
	var tbH = 395;
	
	$("body").delegate("#icon_picker_button","click",function(){

		setTimeout(function() {
			
			tb_show( '<img src="'+$('#icon_picker_button').find('.icon_ico').attr('src')+'" alt="Icon Picker" class="icon_picker_ttl_ico">Icon Picker <span class="cp_version">v'+icon_picker_opt.icon_version+'</span>', '#TB_inline?height=380&width=550&inlineId=iconmarkup' );
			
			$("select#icon_select_icon_source, select#icon_select_icon_bg_shape").val("none");
			$('#icon_insert_icon').attr('value','Insert Icon');
			$("select#icon_icon_align").val("alignnone");
			$("select#icon_icon_size").val("nm");
			jQuery("#TB_window").addClass("TB_icon_window");
			jQuery("#TB_ajaxContent").addClass("TB_icon_ajaxContent");
			$(".TB_icon_ajaxContent").css('overflow','visible');
			$(".selector-popup").css('display','none');
			$('#icon_list').val('');
			$('#is_edit').val('');
			$('#icon_select_icon_source').prop('disabled', false);	
			$('.icon_bg_shape_cont').hide();
			
    		icon_list = $('#icon_list').fontIconPicker({
				emptyIcon: true,
				iconsPerPage: 25,
        		theme: 'fip-bootstrap'
    		}).on('change', function() {
				$('#icon_list').attr('value', $(this).val());
				});
			
			icon_list.destroyPicker();
			icon_list.refreshPicker();
			
			
			var myOptions = {
				defaultColor: false,
				change: function(event, ui){},
				clear: function() {},
				hide: true,
				palettes: true
			};
			 
			$('#icon_set_color, #icon_bg_shape_col').wpColorPicker(myOptions);
			
			
			tbReposition();
			
			$("#TB_closeWindowButton").replaceWith($("<div class='closetb' id='TB_closeWindowButton'><span class='screen-reader-text'>Close</span><span class='tb-close-icon'></span></div>"));

		}, 300);	
		
	});
	
	// Close Thickbox
	$("body").delegate(".closetb","click",function(){
		tb_remove();
	});

	// Select Icon Library
	$('#icon_select_icon_source').on("change",function() {
		
		 $(this).prop('disabled', true);
		 $('.icon_loader').addClass('animate_spin');
		
		getIcon(jQuery(this));
		
	});
	
	// Select Background Shape
	$('#icon_select_icon_bg_shape').on("change",function() {
		if ( jQuery(this).val() == 'none' ) {
			
			$('.icon_bg_shape_cont').hide();
			tbH = 395;
			
		} else {
			$('.icon_bg_shape_cont').fadeIn(500);
			tbH = 445;
		}
		
		tbReposition();
		
	});
	
	
	// Get Icon AJAX
	function getIcon(el) {
		
		jQuery.ajax({
			url: ajaxurl,
			data:{
				'action': 'icon_get_icons_ajax',
				'library': el.val(),
				'security': el.attr('data-icnnonce'),
			},
			dataType: 'json',
			type: 'POST',
			success:function(response){
				
				if (response) {
					
					var all_icons = [];
					
					icon_list.destroyPicker();
					icon_list.refreshPicker();
					
					switch(el.val()) {
						
						case 'fontawesome':
						case 'fontello':
						case 'dashicons':
						case 'openiconic':
						case 'justvector':
						case 'paymentfont':
						case 'icomoon':
						
							$.each(response.glyphs, function(i, v) {
								all_icons.push( response.css_prefix_text + v.css );
							});

						break;
						
						case 'gmaterialicons':
						
							$.each(response.glyphs, function(i, v) {
								all_icons.push( response.css_prefix_text + v.css );
							});
								
							icon_list.refreshPicker({
								needTitle: true,
								theme: 'fip-bootstrap'
								});
						
						break;
							
						default:
							
					} 
		
						// Set new List
						icon_list.setIcons(all_icons);
						
						if ($('#is_edit').val() != 'edit') {
							$('.selector-button').trigger('click');
						} else {
							$('#is_edit').attr('value','');	
						}
						$('#icon_select_icon_source').prop('disabled', false);
						$('.icon_loader').removeClass('animate_spin');
				
				} else {
					
					$('#icon_select_icon_source').prop('disabled', false);
					$('.icon_loader').removeClass('animate_spin');
					
				}
				 
			},
			error: function(errorThrown){
				
				$('#icon_select_icon_source').prop('disabled', false);
				$('.icon_loader').removeClass('animate_spin');
				  
			}
				
		}); // End Grab	
			
	}
	
	$('#icon_insert_icon').on('click', function() {
		
		if ( !!$('#icon_list').val() ) {
			
			var sccode,
			icCol = (($('#icon_set_color').val()) ? ' color='+$('#icon_set_color').val()+'' : '' ),
			icSize = (($('#icon_icon_size').val() != 'nm') ? ' size='+$('#icon_icon_size').val()+'' : '' );
			
			sccode = "[wpicon lib="+$('#icon_select_icon_source option:selected').attr('data-lib')+" type="+$('#icon_list').val().replace(/^fa |dashicons |material-icons |pf |oi\s/i, '')+""+icCol+""+icSize+"]";
		
			if( jQuery('#wp-content-editor-container > textarea').is(':visible') ) {
				var val = jQuery('#wp-content-editor-container > textarea').val() + sccode;
				jQuery('#wp-content-editor-container > textarea').val(val);	
				}
				else {
				tinyMCE.activeEditor.execCommand('mceInsertContent', 0, sccode);
					}

			tb_remove();
			}
			else {
				alert('Please select icon first!');
				//tb_remove();
				}
		
	});

	// Reposition Thickbox
	function tbReposition() {
		
		$('.TB_icon_window').css({
			'top' : ((jQuery(window).height() - 455) / 6) + 'px',
			'left' : ((jQuery(window).width() - 550) / 4) + 'px',
			'margin-top' : ((jQuery(window).height() - 455) / 6) + 'px',
			'margin-left' : ((jQuery(window).width() - 550) / 4) + 'px',
			'max-height' : parseInt(tbH) + 'px',
			'min-height' : parseInt(tbH) + 'px',
		});
			
	}
	
	$(window).resize(function() {
		
		tbReposition();
		
	});
	
	// Thickbox Close Callback
	var old_tb_remove = window.tb_remove;

	var tb_remove = function() {
   	 old_tb_remove();
	 setTimeout(function() {
    	$('.mce-inline-toolbar-grp').hide();
		}, 500);
	};

	
});