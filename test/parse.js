
module("parse");

test("parse value from string", function () {
  var hour = 6, hour2 = 18, 
      minute, base, str, o, e,
      hours = ['6', '06', '18'],
      sep = [':', '', ' ', ' : '],
      minutes = ['09', '9', ''],
      am = ['', 'am', ' a', 'a.m.'],
      pm = ['pm', 'p', ' p.m.'];


        for(var h=0; h<hours.length; h++) {
          for(var s=0; s<sep.length; s++) {
           for(var m=0; m<minutes.length; m++) {
            base = hours[h]+sep[s]+minutes[m];

            minute = minutes[m] !== '' ? parseInt(minutes[m], 10) : null;

          //12h am
          for(var a=0; a<am.length; a++) {
            str = base + am[a];
            ok(true, str);
            e = $('<div></div>').appendTo('#qunit-fixture').clockface({format: 'h'+sep[s]+'mm a'}).clockface('show', str);
            o = e.data('clockface');
            equal(o.hour, hour, 'hour ok');
            equal(o.minute, minute, 'minute ok');
            equal(o.ampm, hours[h] === '18' ? 'pm' : 'am', 'ampm ok');
          }

          //12h pm
          for(a=0; a<pm.length; a++) {
            str = base + pm[a];
            ok(true, str);
            e = $('<div></div>').appendTo('#qunit-fixture').clockface({format: 'h'+sep[s]+'mm a'}).clockface('show', str);
            o = e.data('clockface');
            equal(o.hour, hour, 'hour ok');
            equal(o.minute, minute, 'minute ok');
            equal(o.ampm, 'pm', 'ampm ok');
          }          

          //24h
          str = base;
          ok(true, str);
          e = $('<div></div>').appendTo('#qunit-fixture').clockface({format: 'HH'+sep[s]+'mm'}).clockface('show', str);
          o = e.data('clockface');
          equal(o.hour, hours[h] === '18' ? hour2 : hour, 'hour ok');
          equal(o.minute, minute, 'minute ok');
          equal(o.ampm, hours[h] === '18' ? 'pm' : 'am', 'ampm ok');            
        }
      }
    } 


    //only hours format
    str = '6';
    ok(true, str);
    e = $('<div></div>').appendTo('#qunit-fixture').clockface({format: 'H'}).clockface('show', str);
    o = e.data('clockface');
    equal(o.hour, hour, 'hour ok');
    equal(o.minute, null, 'minute ok');
    equal(o.ampm, 'am', 'ampm ok');     

    str = '6 pm';
    ok(true, str);
    e = $('<div></div>').appendTo('#qunit-fixture').clockface({format: 'hh a'}).clockface('show', str);
    o = e.data('clockface');
    equal(o.hour, hour, 'hour ok');
    equal(o.minute, null, 'minute ok');
    equal(o.ampm, 'pm', 'ampm ok');  

    //with date   
    str = '2012-12-17 6:9';
    ok(true, str);
    e = $('<div></div>').appendTo('#qunit-fixture').clockface({format: 'H:mm'}).clockface('show', str);
    o = e.data('clockface');
    equal(o.hour, hour, 'hour ok');
    equal(o.minute, 9, 'minute ok');
    equal(o.ampm, 'am', 'ampm ok');     

    str = '2012-12-17 6:9 pm';
    ok(true, str);
    e = $('<div></div>').appendTo('#qunit-fixture').clockface({format: 'hh:mm a'}).clockface('show', str);
    o = e.data('clockface');
    equal(o.hour, hour, 'hour ok');
    equal(o.minute, 9, 'minute ok');
    equal(o.ampm, 'pm', 'ampm ok');      
 }); 