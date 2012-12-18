module("popup", {
 setup: function() {
   $.support.transition = false;
 }
});

test("trigger: focus + hide + destroy", function () {
  var e = $('<input value="23:30">').appendTo('#qunit-fixture').clockface({
    format: 'H:mm',
    trigger: 'focus'
  }),
  o = e.data('clockface');
  e.focus();
  ok($('.clockface:visible').length, 'shown on focus');
  equal(o.hour, 23, 'hour ok');
  equal(o.minute, 30, 'minute ok');
  equal(o.ampm, 'pm', 'ampm ok');
  ok(e.hasClass('clockface-open'), 'element has class clockface-open');

  e.clockface('hide');
  ok(!$('.clockface:visible').length, 'closed');
  ok(!e.hasClass('clockface-open'), 'element does not have class clockface-open');

  e.clockface('destroy');
  ok(!$('.clockface').length, 'destroyed');
});  

test("trigger: manual", function () {
  var e = $('<input value="23:30">').appendTo('#qunit-fixture').clockface({
    format: 'H:mm',
    trigger: 'manual'
  }),
  o = e.data('clockface');;
  e.focus();
  ok(!$('.clockface:visible').length, 'not shown on focus');

  e.clockface('destroy');
  ok(!$('.clockface').length, 'destroyed');
});

test("click outside close widget", function () {
  var e = $('<input value="23:30">').appendTo('#qunit-fixture').clockface({
    format: 'H:mm'
  }),
  e2 = $('<input value="23:30">').appendTo('#qunit-fixture').clockface(),
  o = e.data('clockface');
  e.focus();
  ok($('.clockface:visible').length, 'shown');

  //click on element --> not close 
  e.click();
  ok($('.clockface:visible').length, 'shown');

  //click inside clockface --> not close 
  o.$clockface.click();
  ok($('.clockface:visible').length, 'shown');  

  //click on another element --> close 
  e2.click();
  ok(!o.$clockface.is(':visible'), 'closed');

  o.show();

  e.clockface('destroy');
  e2.clockface('destroy');
}); 