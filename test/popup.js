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
  o = e.data('clockface');
  e.focus();
  ok(!$('.clockface:visible').length, 'not shown on focus');

  e.clockface('destroy');
  ok(!$('.clockface').length, 'destroyed');
});

test("toggle", function () {
  var e = $('<input value="23:30">').appendTo('#qunit-fixture').clockface({
    format: 'H:mm'
  }),
  o = e.data('clockface');
  e.clockface('toggle');
  ok($('.clockface:visible').length, 'shown on toggle');
  
  e.clockface('toggle');
  ok(!$('.clockface:visible').length, 'closed on toggle');

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

test("esc, enter, tab close widget", function () {
  var e = $('<input value="23:30">').appendTo('#qunit-fixture').clockface({
    format: 'H:mm'
  }),
  ev, o = e.data('clockface');

  e.focus();
  ok($('.clockface:visible').length, 'shown');

  //esc
  ev = jQuery.Event("keydown");
  ev.which = 27;
  e.trigger(ev);
  ok(!o.$clockface.is(':visible'), 'closed on esc');

  e.focus();
  ok($('.clockface:visible').length, 'shown');
  //enter
  ev = jQuery.Event("keydown");
  ev.which = 13;
  e.trigger(ev);
  ok(!o.$clockface.is(':visible'), 'closed on enter');

  e.focus();
  ok($('.clockface:visible').length, 'shown');
  //tab
  ev = jQuery.Event("keydown");
  ev.which = 9;
  e.trigger(ev);
  ok(!o.$clockface.is(':visible'), 'closed on tab');  

  e.clockface('destroy');
}); 

asyncTest("change value in input reflects clockface", function () {
  var e = $('<input value="23:30">').appendTo('#qunit-fixture').clockface({
    format: 'H:mm'
  }),
  o = e.data('clockface');
  e.focus();
  ok($('.clockface:visible').length, 'shown on focus');

  e.val('11:05');
  e.keydown();

  setTimeout(function(){
    ok(o.$inner.eq(0).is('.active'), 'hour selected');
    equal(o.hour, 11, 'hour ok');
    equal(o.minute, 5, 'minute ok');
    equal(o.ampm, 'am', 'ampm ok');  
    e.clockface('destroy');  
    start();
  }, 700);

});

test("change value in clockface reflects on input", function () {
  var e = $('<input value="23:30">').appendTo('#qunit-fixture').clockface({
    format: 'h:mm'
  }),
  o = e.data('clockface');

  e.focus();
  ok($('.clockface:visible').length, 'shown on focus');

  o.$inner.eq(2).click();
  equal(e.val(), o.getTime(), 'hour in input changed');

  o.$outer.eq(2).click();
  equal(e.val(), o.getTime(), 'minute in input changed');

  o.$ampm.click();
  equal(e.val(), o.getTime(), 'ampm in input changed');

  e.clockface('destroy');
});