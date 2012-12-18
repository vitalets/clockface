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

test("options via data-* attribute", function () {
  var e = $('<div data-format="hh:mm"></div>').clockface();
  equal(e.data('clockface').options.format, 'hh:mm', 'format taken from data-* attribute');
});   

test("show/hide/destroy methods (inline)", function () {
  var e = $('<div></div>').appendTo('#qunit-fixture').clockface(),
      o = e.data('clockface');

  //first show    
  e.clockface('show');
  ok(e.find('.clockface:visible').length, 'shown');
  ok(!o.$inner.filter('.active').length, 'no hour selected');
  ok(!o.$outer.filter('.active').length, 'no minute selected');
  equal(o.hour, null, 'hour ok');
  equal(o.minute, null, 'minute ok');
  equal(o.ampm, 'am', 'ampm ok');  

  //set some value
  o.$inner.eq(1).click();
  equal(o.hour, 0, 'hour ok');
  ok(o.$inner.eq(1).is('.active'), 'hour selected');

  //hide
  e.clockface('hide');
  ok(!e.find('.clockface:visible').length, 'hidden');

  //show again: selected hour should be the same
  e.clockface('show');
  ok(e.find('.clockface:visible').length, 'shown');
  equal(o.hour, 0, 'hour ok');
  ok(o.$inner.eq(1).is('.active'), 'hour selected');  
 
  //destroy 
  e.clockface('destroy');
  ok(!e.find('.clockface').length, 'destroyed completely');
});  

test("set value from Date object", function () {
  var d_am = new Date(1984, 5, 15, 3, 25),
      d_pm = new Date(1984, 5, 15, 13, 25),
      e, o;

  //12h am 
  e = $('<div></div>').appendTo('#qunit-fixture').clockface({format: 'h:mm a'}).clockface('show', d_am);
  o = e.data('clockface');
  equal(o.hour, d_am.getHours(), 'hour ok');
  equal(o.minute, d_am.getMinutes(), 'minute ok');
  equal(o.ampm, 'am', 'ampm ok');

  equal(parseInt(o.$inner.filter('.active').text(), 10), o.hour, 'display hour ok');
  equal(parseInt(o.$outer.filter('.active').text(), 10), o.minute, 'display minute ok');
  equal(o.$ampm.text(), 'AM', 'display ampm ok');

  //12h pm 
  e = $('<div></div>').appendTo('#qunit-fixture').clockface({format: 'h:mm a'}).clockface('show', d_pm);
  o = e.data('clockface');
  equal(o.hour, d_pm.getHours()-12, 'hour ok');
  equal(o.minute, d_pm.getMinutes(), 'minute ok');
  equal(o.ampm, 'pm', 'ampm ok');
  equal(parseInt(o.$inner.filter('.active').text(), 10), o.hour, 'display hour ok');
  equal(parseInt(o.$outer.filter('.active').text(), 10), o.minute, 'display minute ok');
  equal(o.$ampm.text(), 'PM', 'display ampm ok'); 

  //24h am 
  e = $('<div></div>').appendTo('#qunit-fixture').clockface({format: 'H:mm'}).clockface('show', d_am);
  o = e.data('clockface');
  equal(o.hour, d_am.getHours(), 'hour ok');
  equal(o.minute, d_am.getMinutes(), 'minute ok');
  equal(o.ampm, 'am', 'ampm ok');
  equal(parseInt(o.$inner.filter('.active').text(), 10), o.hour, 'display hour ok');
  equal(parseInt(o.$outer.filter('.active').text(), 10), o.minute, 'display minute ok');
  equal(o.$ampm.text(), '12-23', 'display ampm ok');

  //24h pm 
  e = $('<div></div>').appendTo('#qunit-fixture').clockface({format: 'H:mm'}).clockface('show', d_pm);
  o = e.data('clockface');
  equal(o.hour, d_pm.getHours(), 'hour ok');
  equal(o.minute, d_pm.getMinutes(), 'minute ok');
  equal(o.ampm, 'pm', 'ampm ok');
  equal(parseInt(o.$inner.filter('.active').text(), 10), o.hour, 'display hour ok');
  equal(parseInt(o.$outer.filter('.active').text(), 10), o.minute, 'display minute ok');
  equal(o.$ampm.text(), '0-11', 'display ampm ok');  
}); 

test("incorrect input value", function () { 
    var o, e;
    e = $('<div></div>').appendTo('#qunit-fixture').clockface({format: 'h:mm a'}).clockface('show', '56:23');
    o = e.data('clockface');
    equal(o.hour, null, 'hour ok');
    equal(o.minute, 23, 'minute ok');

    e = $('<div></div>').appendTo('#qunit-fixture').clockface({format: 'h:mm a'}).clockface('show', '6:84');
    o = e.data('clockface');
    equal(o.hour, 6, 'hour ok');
    equal(o.minute, null, 'minute ok');    

    e = $('<div></div>').appendTo('#qunit-fixture').clockface({format: 'h:mm a'}).clockface('show', '56:84');
    o = e.data('clockface');
    equal(o.hour, null, 'hour ok');
    equal(o.minute, null, 'minute ok');     
});

test("click hour / minute", function () {
  var  e = $('<div></div>').appendTo('#qunit-fixture').clockface({format: 'H:mm'}).clockface('show', '12:00'),
       o = e.data('clockface');

  //hour click
  o.$inner.eq(2).click();
  equal(o.hour, 13, 'hour click ok');
  ok(o.$inner.eq(2).hasClass('active'), 'new cell selected');
  ok(!o.$inner.eq(1).hasClass('active'), 'old cell deselected');
  ok(o.$outer.eq(1).hasClass('active'), 'minute not changed');

  //minute click
  o.$outer.eq(2).click();
  equal(o.minute, 5, 'minute click ok');
  ok(o.$outer.eq(2).hasClass('active'), 'new cell selected');
  ok(!o.$outer.eq(1).hasClass('active'), 'old cell deselected');
  ok(o.$inner.eq(2).hasClass('active'), 'hour not changed');

  //hour second click (deselect)
  o.$inner.eq(2).click();
  ok(!o.$inner.eq(2).hasClass('active'), 'hour deselected on second click');
  equal(o.hour, null, 'hour is null');

  //minute second click (deselect)
  o.$outer.eq(2).click();
  ok(!o.$outer.eq(2).hasClass('active'), 'minute deselected on second click');
  equal(o.minute, null, 'minute is null');
});

test("click ampm", function () {
  var  e = $('<div></div>').appendTo('#qunit-fixture').clockface({format: 'H:mm'}).clockface('show', '13:00'),
       o = e.data('clockface');

  //24h
  ok(o.$inner.eq(2).hasClass('active'), 'hour selected');
  equal(o.$inner.eq(1).text(), '12', '12 shown at 0');
  equal(o.$ampm.text(), '0-11', 'ampm text ok');
  o.$ampm.click();     
  ok(!o.$inner.eq(2).hasClass('active'), 'hour not selected in am');
  equal(o.$inner.eq(1).text(), '0', '0 shown at 0');
  equal(o.$ampm.text(), '12-23', 'ampm text ok');
  o.$ampm.click();     
  ok(o.$inner.eq(2).hasClass('active'), 'hour selected in pm');  

  //12h 
  e = $('<div></div>').appendTo('#qunit-fixture').clockface({format: 'h:mm a'}).clockface('show', '1:00 pm');
  o = e.data('clockface');
  ok(o.$inner.eq(2).hasClass('active'), 'hour cell selected');
  equal(o.$inner.eq(1).text(), '12', '12 shown at 0');
  equal(o.$ampm.text(), 'PM', 'ampm text ok');
  o.$ampm.click();     
  ok(o.$inner.eq(2).hasClass('active'), 'hour selected in am');
  equal(o.$inner.eq(1).text(), '0', '0 shown at 0');
  equal(o.$ampm.text(), 'AM', 'ampm text ok');
  o.$ampm.click();     
  ok(o.$inner.eq(2).hasClass('active'), 'hour selected in pm');  
});

test("getTime", function () {
  var  e, f, t;

  f = 'H:mm';
  e = $('<div></div>').appendTo('#qunit-fixture').clockface({format: f}).clockface('show', '1:01');
  equal(e.clockface('getTime'), '1:01', f+' ok');

  f = 'HH:mm';
  e = $('<div></div>').appendTo('#qunit-fixture').clockface({format: f}).clockface('show', '1:01');
  equal(e.clockface('getTime'), '01:01', f+' ok');

  f = 'HH';
  e = $('<div></div>').appendTo('#qunit-fixture').clockface({format: f}).clockface('show', '1:01');
  equal(e.clockface('getTime'), '01', f+' ok');  

  f = 'h:mm a';
  e = $('<div></div>').appendTo('#qunit-fixture').clockface({format: f}).clockface('show', '1:01 pm');
  equal(e.clockface('getTime'), '1:01 pm', f+' ok');

  f = 'hh:mmA';
  e = $('<div></div>').appendTo('#qunit-fixture').clockface({format: f}).clockface('show', '1:01 a.m.');
  equal(e.clockface('getTime'), '01:01AM', f+' ok');

  f = 'hh:mm';
  e = $('<div></div>').appendTo('#qunit-fixture').clockface({format: f}).clockface('show', '1:01 pm');
  equal(e.clockface('getTime'), '01:01', f+' ok');  

  f = 'h a';
  e = $('<div></div>').appendTo('#qunit-fixture').clockface({format: f}).clockface('show', '1 pm');
  equal(e.clockface('getTime'), '1 pm', f+' ok');    

  //null values
  f = 'hh:mm';
  e = $('<div></div>').appendTo('#qunit-fixture').clockface({format: f}).clockface('show', '56:01 pm');
  equal(e.clockface('getTime'), ':01', 'null hour ok');  

  f = 'h:mm a';
  e = $('<div></div>').appendTo('#qunit-fixture').clockface({format: f}).clockface('show', '6:71 pm');
  equal(e.clockface('getTime'), '6 pm', f+'null minute ok');   

  //as object 
  f = 'h:mm a';
  e = $('<div></div>').appendTo('#qunit-fixture').clockface({format: f}).clockface('show', '6:21 pm');
  t = e.clockface('getTime', true);
  equal(t.hour, 6, 'hour ok');   
  equal(t.minute, 21, 'minute ok');   
  equal(t.ampm, 'pm', 'hour ok');   
});


test("events: shown, pick, hide", function () {
  expect(15);

  var  e = $('<div></div>').appendTo('#qunit-fixture').clockface({format: 'hh:mm'}),
       o = e.data('clockface'),
       hour = 10, minute = 0, ampm = 'am';

  e.on('shown.clockface', function(e, data){
      equal(data.hour, hour, 'hour ok');
      equal(data.minute, minute, 'minute ok');
      equal(data.ampm, ampm, 'ampm ok');
  });

  //triggerred 3 times: on pick hour, minute and ampm
  e.on('pick.clockface', function(e, data){
      equal(data.hour, hour, 'hour ok');
      equal(data.minute, minute, 'minute ok');
      equal(data.ampm, ampm, 'ampm ok');
  });  

  e.on('hidden.clockface', function(e, data){
      equal(data.hour, hour, 'hour ok');
      equal(data.minute, minute, 'minute ok');
      equal(data.ampm, ampm, 'ampm ok');
  });  

  //should not be triggered as in another namespace
  e.on('shown', function(){ ok(true, 'extra shown event triggered'); });
  e.on('hidden', function(){ ok(true, 'extra hidden event triggered'); });
  e.on('pick', function(){ ok(true, 'extra pick event triggered'); });  

  e.clockface('show', '10:00');

  hour = 11;
  o.$inner.eq(0).click();

  minute = 5;       
  o.$outer.eq(2).click();

  ampm = 'pm';
  o.$ampm.click();

  e.clockface('destroy');
});