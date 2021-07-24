//IDENTIFY NODES
var nodes = $('ul.hex-grid-row li'); //GRIDnodescr
var nodescr = $('ul.hex-grid-row li textarea'); //GRIDnodescr
//MAP ALL THE NODES' TYPE
function mapnodes() {
    var nmap = nodes.map(function() {
        return $(this).attr('class').replace('c', '');
    }).get().join('');
    $('textarea#map').val(nmap);
}
//PADDING BASED ON NUMBER OF LINES
function nodepad(elem) {
    var rows = elem.val().split('\n').length;
    var pad = 31 - (rows * 5);
    if (rows > 1) {
        elem.css('padding-top', pad + 'px');
    } else {
        elem.removeAttr("style");
    }
}
//COUNT HOW MANY COLORED NODES
function countnodes() {
    var stat = $('.c1').length,
	mpow = $('.cA,.cB,.cC,.cD,.cE,.cF,.cG,.cH,.cI,.cJ,.cK,.cL,.cM,.cN,.cO,.cP,.cQ,.cR').length,
	skill = $('.c3').length,
	mskl = $('.c4').length,
	sync = $('.c5').length,
	center = $('.c6').length;
    $("#statcount").text(stat);
    $("#mpowcount").text(mpow);
    $("#skillcount").text(skill);
    $("#msklcount").text(mskl);
    $("#synccount").text(sync);
    $("#centercount").text(center);
    $("#nodecount").text(stat + mpow + skill + mskl + sync + center);
}
//SET MAP
$(".setmap").click(function() {
	setmap();
});
function setmap() {
    var r = confirm("This will apply the map to sync grid.");
    if (r == true) {
        var nodemap = $('textarea#map').val().split('');
        for (var i = 0, length = nodemap.length; i < length; i++) {
			if (nodemap[i] == 'X') {
				$(nodes[i]).attr('class', 'cX');
				$(nodes[i]).find('object.node-icon').removeAttr("data");
			}
			else if (nodemap[i] == '1') {
				$(nodes[i]).attr('class', 'c1');
				$(nodes[i]).find('object.node-icon').attr("data", "img/icons/statistic.svg");
			}
			else if (nodemap[i] == '3') {
				$(nodes[i]).attr('class', 'c3');
				$(nodes[i]).find('object.node-icon').attr("data", "img/icons/passive.svg");
			}
			else if (nodemap[i] == '4') {
				$(nodes[i]).attr('class', 'c4');
				$(nodes[i]).find('object.node-icon').attr("data", "img/icons/passive.svg");
			}
			else if (nodemap[i] == '5') {
				$(nodes[i]).attr('class', 'c5');
				$(nodes[i]).find('object.node-icon').attr("data", "img/icons/sync.svg");
			}
			else if (nodemap[i] == '6') {
				$(nodes[i]).attr('class', 'c6');
				$(nodes[i]).find('object.node-icon').attr("data", "img/icons/center.svg");
			}
			else {
				$(nodes[i]).attr('class', 'c' + nodemap[i]);
				$(nodes[i]).find('object.node-icon').attr("data", "img/icons/" + nodemap[i] + ".svg");
			}
        }
        countnodes();
		$('input.color-rad').prop('checked', false);
		$('input#txt').prop('checked', true);
    }
}
//CLEAR MAP
$(".clearmap").click(function() {
    var r = confirm("This will purge the Sync Grid.");
    if (r == true) {
        $('textarea#map').val('');
        $(nodes).attr('class', 'c0');
		$(nodescr).val('');
		$('object.node-icon').removeAttr("data");
        countnodes();
    }
});
//NODE INPUT LENGTH, LINES, PADDING, AND ARROW KEYS NAVIGATION
nodescr.on('input focus keydown', function(e) {
	//brush($(this).closest('li'));
	var nodex = $(this).closest('li').index(),
	nodey = $(this).closest('.hex-grid-row').index(),
	xin = $(this).closest('li').siblings('li').length,
	yin = $(this).closest('.hex-grid-row').siblings('.hex-grid-row').length,
	text = $(this).val(),
	caretA = $(this).prop("selectionStart"),
	caretB = $(this).prop("selectionEnd"),
    rows = $(this).val().split('\n').length;
	var textlen = text.length,
    lines = text.split(/(\r\n|\n|\r)/gm);
	for (var i = 0; i < lines.length; i++) {
        if (lines[i].length > 8) {
            lines[i] = lines[i].substring(0, 8);
        }
    }
    $(this).val(lines.join(''));
    nodepad($(this));
	 //DISABLE ENTER KEY IF IT'S ALREADY 5 ROWS, THE MAXIMUM NUMBER OF VISIBLE ROW.
    if (e.keyCode == 13 && rows >= 5) {	
		if (nodey == yin) {
			var moveto = $(this).closest('.hex-grid-body').find('.hex-grid-row:eq(0)').find('textarea:eq(' + nodex + ')');
			moveto.prop("disabled", false).focus();
		}
        else {
			var moveto = $(this).closest('.hex-grid-row').next('.hex-grid-row').find('textarea:eq(' + nodex + ')');
			moveto.prop("disabled", false).focus();
		}
        return false;
    }
	 //DISABLE TAB KEY
    else if (e.keyCode == 9) {
        return false;
    }
	 //DISABLE ESC KEY, END INPUT
    else if (e.keyCode == 27) {
		$(this).blur().prop("disabled", true);
        return false;
    }
	//RIGHT, SWITCH FOCUS TO A NODE TO THE RIGHT
    else if (e.keyCode == 39 && caretB >= textlen) {
		if (nodex == xin) {
			var moveto = $(this).closest('.hex-grid-row').find('textarea:eq(0)');
		}
		else {
		var moveto = $(this).closest('.hex-grid-row').find('textarea:eq(' + ( nodex + 1 ) + ')');
		}
		moveto.prop("disabled", false).focus();
        return false;f
    } //LEFT, SWITCH FOCUS TO A NODE TO THE LEFT
    else if (e.keyCode == 37 && caretA <= 0) {
		if (nodex == 0) {
			var moveto = $(this).closest('.hex-grid-row').find('textarea:eq(' + xin + ')');
		}
		else {
		var moveto = $(this).closest('.hex-grid-row').find('textarea:eq(' + ( nodex - 1 ) + ')');
		}
		moveto.prop("disabled", false).focus();
        return false;
    } //DOWN, SWITCH FOCUS TO A NODE BELLOW
    else if (e.keyCode == 40 && caretB >= textlen) {
		if (nodey == yin) {
			var moveto = $(this).closest('.hex-grid-body').find('.hex-grid-row:eq(0)').find('textarea:eq(' + nodex + ')');
		}
        else {
			var moveto = $(this).closest('.hex-grid-row').next('.hex-grid-row').find('textarea:eq(' + nodex + ')');
		}
		moveto.prop("disabled", false).focus();
        return false;
    } //UP, SWITCH FOCUS TO A NODE ABOVE
    else if (e.keyCode == 38 && caretA <= 0) {
		if (nodey == 0) {
			var moveto = $(this).closest('.hex-grid-body').find('.hex-grid-row:eq(' + yin + ')').find('textarea:eq(' + nodex + ')');
		}
        else {
			var moveto = $(this).closest('.hex-grid-row').prev('.hex-grid-row').find('textarea:eq(' + nodex + ')');
		}
		moveto.prop("disabled", false).focus();
        return false;
    } 
});
//BRUSH NODE
$('.hex-grid-body').mousedown(function() {
        nodes.bind('mouseover', function() {
            brush(this);
        });
    })
    .mouseup(function() {
        nodes.unbind('mouseover');
        mapnodes();
        countnodes();
    });
nodes.mousedown(function() {
    brush(this);
});
//CHANGE NODE TYPE WITH BRUSH
var mtype = "A";
function brush(elem) {
    var elem = $(elem);
	var icon = elem.find('object.node-icon');
    if ($('#stat').is(':checked')) {
        elem.attr('class', 'c1');
		icon.attr("data", "img/icons/statistic.svg");
    } else if ($('#power').is(':checked')) {
        elem.attr('class', 'c' + mtype);
		icon.attr("data", "img/icons/" + mtype + ".svg");
    } else if ($('#skill').is(':checked')) {
        elem.attr('class', 'c3');
		icon.attr("data", "img/icons/passive.svg");
    } else if ($('#msk').is(':checked')) {
        elem.attr('class', 'c4');
		icon.attr("data", "img/icons/passive.svg");
    } else if ($('#sync').is(':checked')) {
        elem.attr('class', 'c5');
		icon.attr("data", "img/icons/sync.svg");
    } else if ($('#center').is(':checked')) {
        elem.attr('class', 'c6');
		icon.attr("data", "img/icons/center.svg");
    } else if ($('#none').is(':checked')) {
        elem.attr('class', 'cX');
		icon.removeAttr("data");
    }
}
$('select#type').on('change', function() {
	mtype = $(this).val();
});
//FOCUSOUT
nodescr.on("focusout", function(e) {
	$(this).prop("disabled", true);
});
//DOUBLE CLICK TO ADD DESCRIPTION
nodes.dblclick(function() {
	$(this).find('textarea').prop("disabled", false).focus();
});
$("#type").on('change', function(){
	$("input#power").prop("checked",true);
});
//DOC READY
$(document).ready(function(e) {
	//opentools
	$(".openedit").click(function() {
		$(".hex-grid-tools").toggleClass("open");
		console.log("open");
	});
    mapnodes();
    countnodes();
    nodescr.each(function(index) {
        var elem = $(this);
        nodepad(elem);
		$(this).prop("disabled", true);
    });
	var row = 1;
	var tind = 1;
	$(".hex-grid-body li.hex-grid-row").each(function () {
		$(this).attr('id', function (index) {
			return "row-" + row;
		});
		row++;
	});
	$(".hex-grid-body li textarea").each(function () {
		$(this).attr('id', function (index) {
			return "desc-" + tind;
		});
		tind++;
	});
	
	//STOP SELECTION IN NON-INPUT
	$(document).bind('mousedown selectstart', function(e) {
		return $(e.target).is('input, textarea, select, option, html');
	});
});
