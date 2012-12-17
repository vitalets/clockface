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

test("show method (inline)", function () {
  var e = $('<div></div>').appendTo('#qunit-fixture').clockface();
  e.clockface('show');
  ok(e.find('.clockface:visible').length, 'shown');
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
  equal(o.$ampm.text(), o.options.am, 'display ampm ok');

  //12h pm 
  e = $('<div></div>').appendTo('#qunit-fixture').clockface({format: 'h:mm a'}).clockface('show', d_pm);
  o = e.data('clockface');
  equal(o.hour, d_pm.getHours()-12, 'hour ok');
  equal(o.minute, d_pm.getMinutes(), 'minute ok');
  equal(o.ampm, 'pm', 'ampm ok');
  equal(parseInt(o.$inner.filter('.active').text(), 10), o.hour, 'display hour ok');
  equal(parseInt(o.$outer.filter('.active').text(), 10), o.minute, 'display minute ok');
  equal(o.$ampm.text(), o.options.pm, 'display ampm ok'); 

  //24h am 
  e = $('<div></div>').appendTo('#qunit-fixture').clockface({format: 'H:mm'}).clockface('show', d_am);
  o = e.data('clockface');
  equal(o.hour, d_am.getHours(), 'hour ok');
  equal(o.minute, d_am.getMinutes(), 'minute ok');
  equal(o.ampm, 'am', 'ampm ok');
  equal(parseInt(o.$inner.filter('.active').text(), 10), o.hour, 'display hour ok');
  equal(parseInt(o.$outer.filter('.active').text(), 10), o.minute, 'display minute ok');
  equal(o.$ampm.text(), o.options.am, 'display ampm ok');

  //24h pm 
  e = $('<div></div>').appendTo('#qunit-fixture').clockface({format: 'H:mm'}).clockface('show', d_pm);
  o = e.data('clockface');
  equal(o.hour, d_pm.getHours(), 'hour ok');
  equal(o.minute, d_pm.getMinutes(), 'minute ok');
  equal(o.ampm, 'pm', 'ampm ok');
  equal(parseInt(o.$inner.filter('.active').text(), 10), o.hour, 'display hour ok');
  equal(parseInt(o.$outer.filter('.active').text(), 10), o.minute, 'display minute ok');
  equal(o.$ampm.text(), o.options.pm, 'display ampm ok');  
}); 

test("parse value from string", function () {
  var hour = 6, hour2 = 18,
      minute = 9, str, o, e,
      hours = ['6', '06', '18'],
      sep = [':', '', ' '],
      minutes = ['09'],
      am = ['', 'am', ' a', 'a.m.'],
      pm = ['pm', 'p', ' p.m.'];


      for(var h=0; h<hours.length; h++) {
        for(var s=0; s<sep.length; s++) {
         for(var m=0; m<minutes.length; m++) {
          //12h am
          for(var a=0; a<am.length; a++) {
            str = hours[h]+sep[s]+minutes[m]+am[a];
            ok(true, str);
            e = $('<div></div>').appendTo('#qunit-fixture').clockface({format: 'h'+sep[s]+'mm a'}).clockface('show', str);
            o = e.data('clockface');
            equal(o.hour, hour, 'hour ok');
            equal(o.minute, minute, 'minute ok');
            equal(o.ampm, hours[h] === '18' ? 'pm' : 'am', 'ampm ok');
          }

          //12h pm
          for(var a=0; a<pm.length; a++) {
            str = hours[h]+sep[s]+minutes[m]+pm[a];
            ok(true, str);
            e = $('<div></div>').appendTo('#qunit-fixture').clockface({format: 'h'+sep[s]+'mm a'}).clockface('show', str);
            o = e.data('clockface');
            equal(o.hour, hour, 'hour ok');
            equal(o.minute, minute, 'minute ok');
            equal(o.ampm, 'pm', 'ampm ok');
          }          

          //24h
          str = hours[h]+sep[s]+minutes[m];
          ok(true, str);
          e = $('<div></div>').appendTo('#qunit-fixture').clockface({format: 'HH'+sep[s]+'mm'}).clockface('show', str);
          o = e.data('clockface');
          equal(o.hour, hours[h] === '18' ? hour2 : hour, 'hour ok');
          equal(o.minute, minute, 'minute ok');
          equal(o.ampm, hours[h] === '18' ? 'pm' : 'am', 'ampm ok');            
        }
      }
    } 
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
  equal(o.$ampm.text(), o.options.pm, 'ampm text ok');
  o.$ampm.click();     
  ok(o.$inner.eq(2).hasClass('active'), 'hour selected in am');
  equal(o.$inner.eq(1).text(), '0', '0 shown at 0');
  equal(o.$ampm.text(), o.options.am, 'ampm text ok');
  o.$ampm.click();     
  ok(o.$inner.eq(2).hasClass('active'), 'hour selected in pm');  
});

test("getTime", function () {
  var  e, f;

  f = 'H:mm';
  e = $('<div></div>').appendTo('#qunit-fixture').clockface({format: f}).clockface('show', '1:01');
  equal(e.data('clockface').getTime(), '1:01', f+' ok');

  f = 'HH:mm';
  e = $('<div></div>').appendTo('#qunit-fixture').clockface({format: f}).clockface('show', '1:01');
  equal(e.data('clockface').getTime(), '01:01', f+' ok');

  f = 'h:mm a';
  e = $('<div></div>').appendTo('#qunit-fixture').clockface({format: f}).clockface('show', '1:01 pm');
  equal(e.data('clockface').getTime(), '1:01 pm', f+' ok');

  f = 'hh:mmA';
  e = $('<div></div>').appendTo('#qunit-fixture').clockface({format: f}).clockface('show', '1:01 a.m.');
  equal(e.data('clockface').getTime(), '01:01AM', f+' ok');

  f = 'hh:mm';
  e = $('<div></div>').appendTo('#qunit-fixture').clockface({format: f}).clockface('show', '1:01 pm');
  equal(e.data('clockface').getTime(), '01:01', f+' ok');  
});





