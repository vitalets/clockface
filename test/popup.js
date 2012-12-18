module("popup", {
 setup: function() {
   $.support.transition = false;
 }
});

test("trigger: focus", function () {
  var e = $('<input value="23:30">').appendTo('#qunit-fixture').clockface({
    format: 'H:mm',
    trigger: 'focus'
  }),
  o = e.data('clockface');;
  e.focus();
  ok($('.clockface:visible').length, 'shown on focus');
  equal(o.hour, 23, 'hour ok');
  equal(o.minute, 30, 'minute ok');
  equal(o.ampm, 'pm', 'ampm ok');
  o.hide();
  ok(!$('.clockface:visible').length, 'closed');
});  

test("trigger: manual", function () {
  var e = $('<input value="23:30">').appendTo('#qunit-fixture').clockface({
    format: 'H:mm',
    trigger: 'manual'
  }),
  o = e.data('clockface');;
  e.focus();
  ok(!$('.clockface:visible').length, 'not shown on focus');
});