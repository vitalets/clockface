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

/*
test("should add 'editable' class when applied", function () {
  var editable = $('<a href="#" id="a">link</a>').appendTo('#qunit-fixture').editable();
  ok($('.editable').length, 'editable class exists');
});
*/
