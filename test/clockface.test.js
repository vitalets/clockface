module("main", {
 setup: function() {
   $.support.transition = false;
 }
});

test("should be defined on jquery object", function () {
  var div = $("<div></div>");
  ok(div.clockface, 'editable method is defined');
});

test("should return element", function () {
  var div = $('<div></div>');
  ok(div.clockface() == div, 'element returned');
});  

test("should expose defaults var for settings", function () {
  ok($.fn.clockface.defaults, 'default object exposed');
});    

test("should store instance in data object", function () {
  var e = $('<div></div>').clockface();
  ok(!!e.data('clockface'), 'instance exists in data');
});      

/*
test("should add 'editable' class when applied", function () {
  var editable = $('<a href="#" id="a">link</a>').appendTo('#qunit-fixture').editable();
  ok($('.editable').length, 'editable class exists');
});
*/
