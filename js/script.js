var nodes = $('.hex-grid-row textarea'); //GRIDNODES

//COUNT HOW MANY COLORED NODES
function countnodes() {
    var nodecount = $('.c1,.c2,.c3,.c4,.c5,.c6').length;
    $("#nodecount").text(nodecount);
}
//MAP ALL THE NODES' TYPE
function mapnodes() {
    var nmap = nodes.map(function() {
        return $(this).attr('class').replace('c', '');
    }).get().join('');
    $('input#map').val(nmap);
}
//CHANGE NODE TYPE WITH BRUSH
function brush(elem) {
    var elem = $(elem);
    if ($('#stat').is(':checked')) {
        elem.attr('class', 'c1');
    } else if ($('#power').is(':checked')) {
        elem.attr('class', 'c2');
    } else if ($('#skill').is(':checked')) {
        elem.attr('class', 'c3');
    } else if ($('#msk').is(':checked')) {
        elem.attr('class', 'c4');
    } else if ($('#sync').is(':checked')) {
        elem.attr('class', 'c5');
    } else if ($('#center').is(':checked')) {
        elem.attr('class', 'c6');
    } else if ($('#none').is(':checked')) {
        elem.attr('class', 'c0').val('');
    }
}
//NODE INPUT LENGTH, LINES, PADDING, AND ARROW KEYS NAVIGATION
nodes.on('input focus keydown', function(e) {
	var nodex = $(this).index();
	var nodey = $(this).closest('.hex-grid-row').index();
	var xin = $(this).siblings('textarea').length;
	var yin = $(this).closest('.hex-grid-row').siblings('.hex-grid-row').length;
    var text = $(this).val();
	var textlen = text.length;
    var lines = text.split(/(\r\n|\n|\r)/gm);
	var caretA = $(this).prop("selectionStart");
	var caretB = $(this).prop("selectionEnd");
    var rows = $(this).val().split('\n').length;
    for (var i = 0; i < lines.length; i++) {
        if (lines[i].length > 8) {
            lines[i] = lines[i].substring(0, 8);
        }
    }
    $(this).val(lines.join(''));
    nodepad($(this));
	 //DISABLE ENTER KEY IF IT'S ALREADY 5 ROWS, THE MAXIMUM NUMBER OF VISIBLE ROW.
    if (e.keyCode == 13 && rows >= 5) {
        return false;
    }
	 //DISABLE TAB KEY
    else if (e.keyCode == 9) {
        return false;
    }
	//RIGHT, SWITCH FOCUS TO A NODE TO THE RIGHT
    else if (e.keyCode == 39 && caretB >= textlen) {
		if (nodex == xin) {
			$(this).closest('.hex-grid-row').find('textarea:eq(0)').focus();
		}
		else {
			$(this).next('textarea').focus();
		}
        return false;
    } //LEFT, SWITCH FOCUS TO A NODE TO THE LEFT
    else if (e.keyCode == 37 && caretA <= 0) {
		if (nodex == 0) {
			$(this).closest('.hex-grid-row').find('textarea:eq(' + xin + ')').focus();
		}
		else {
			$(this).prev('textarea').focus();
		}
        return false;
    } //DOWN, SWITCH FOCUS TO A NODE BELLOW
    else if (e.keyCode == 40 && caretB >= textlen) {
		if (nodey == yin) {
			var moveto = $(this).closest('.hex-grid-body').find('.hex-grid-row:eq(0)').find('textarea:eq(' + nodex + ')');
		}
        else {
			var moveto = $(this).closest('.hex-grid-row').next('.hex-grid-row').find('textarea:eq(' + nodex + ')');
		}
		moveto.focus();
        return false;
    } //UP, SWITCH FOCUS TO A NODE ABOVE
    else if (e.keyCode == 38 && caretA <= 0) {
		if (nodey == 0) {
			var moveto = $(this).closest('.hex-grid-body').find('.hex-grid-row:eq(' + yin + ')').find('textarea:eq(' + nodex + ')');
		}
        else {
			var moveto = $(this).closest('.hex-grid-row').prev('.hex-grid-row').find('textarea:eq(' + nodex + ')');
		}
		moveto.focus();
        return false;
    } 
});
//PADDING BASED ON NUMBER OF LINES
function nodepad(elem) {
    var rows = elem.val().split('\n').length;
    var pad = 32 - (rows * 6);
    if (rows > 1) {
        elem.css('padding-top', pad + 'px');
    } else {
        elem.removeAttr("style");
    }
}
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
//SET MAP
$(".setmap").click(function() {
    var r = confirm("This will apply the map to sync grid.");
    if (r == true) {
        var nodemap = $('input#map').val().split('');
        for (var i = 0, length = nodemap.length; i < length; i++) {
            $(nodes[i]).attr('class', 'c' + nodemap[i]);
        }
        countnodes();
    }
});
//CLEAR MAP
$(".clearmap").click(function() {
    var r = confirm("This will purge the Sync Grid.");
    if (r == true) {
        $('input#map').val('');
        $(nodes).attr('class', 'c0').val('');
        countnodes();
    }
});
//DOC READY
$(document).ready(function(e) {
    mapnodes();
    countnodes();
    nodes.each(function(index) {
        var elem = $(this);
        nodepad(elem);
    });
});