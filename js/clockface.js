/**
Clockface timepicker

Confusion with noon and midnight: 
http://en.wikipedia.org/wiki/12-hour_clock
In clockface considered '00:00 am' as midnight and '12:00 pm' as noon.

**/
(function ($) {

    var Clockface = function (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, $.fn.clockface.defaults, options);
        this.init();  
     };

    Clockface.prototype = {
        constructor: Clockface, 
        init: function () {
          //apply template
          this.$clockface = $($.fn.clockface.template);
          this.$clockface.find('.l1 .cell, .left.cell').html('<div class="outer"></div><div class="inner"></div>'); 
          this.$clockface.find('.l5 .cell, .right.cell').html('<div class="inner"></div><div class="outer"></div>'); 

          this.$outer = this.$clockface.find('.outer');
          this.$inner = this.$clockface.find('.inner');
          this.$ampm = this.$clockface.find('.ampm');

          //internal vars
          this.ampm = null;
          this.hour = null;
          this.minute = null;
          
          //click am/pm 
          this.$ampm.click($.proxy(this.clickAmPm, this));

          //click cell
          this.$clockface.on('click', '.cell', $.proxy(this.click, this));

          this.parseFormat();

          if(this.is24) {
             this.options.am = '12-23';
             this.options.pm = '0-11';
          } 

          this.isInline = this.$element.is('div');
         
          //fill minutes once
          this.fill('minute');
        },

        /*
        returns values of hours or minutes, depend on ampm and 24/12 format (0-11, 12-23, 00-55, etc)
        param what: 'hour'/'minute'
        */
        getValues: function(what) {
          var values = [11, 0, 1, 10, 2, 9, 3, 8, 4, 7, 6, 5],
              result = [];

          if(what === 'minute') {
              $.each(values, function(i, v) { result[i] = v*5; });
          } else if(this.ampm === 'pm') {
              if(this.is24) {
                $.each(values, function(i, v) { result[i] = v+12; });
              } else {
                result = values.slice();
                result[1] = 12; //need this to show '12' instead of '0' for 12h pm
              }
          } else {
             result = values.slice();
          }
          return result;
        },

        /*
        Displays widget with specified value
        */
        show: function(value) {
            if(this.isInline) {
                this.$element.empty().append(this.$clockface);
            }
            this.setTime(value);
        },

        /*
        Set ampm and re-fill hours
        */
        setAmPm: function(value) {
          if(value === this.ampm) {
             return;
          } else {
             this.ampm = value;
          }

          //set link's text
          this.$ampm.text(this.ampm === 'am' ? this.options.am : this.options.pm);

          this.fill('hour');
          this.highlight('hour');
        },   
        /*
        Sets hour value and highlight if possible
        */
        setHour: function(value) {
          this.hour = parseInt(value, 10);
          this.highlight('hour');
        },

        /*
        Sets minute value and highlight
        */
        setMinute: function(value) {
          this.minute = parseInt(value, 10);
          this.highlight('minute');
        },        

        /*
        Highlights hour/minute
        */
        highlight: function(what) {
          var index,
              values = this.getValues(what),
              value = what === 'minute' ? this.minute : this.hour,
              $cells = what === 'minute' ? this.$outer : this.$inner;

          $cells.removeClass('active');

          //find index of value and highlight if possible
          index = $.inArray(value, values);
          if(index >= 0) {
            $cells.eq(index).addClass('active');
          }
        },

        /*
        Fill values around
        */ 
        fill: function(what) {
          var values = this.getValues(what),
              $cells = what === 'minute' ? this.$outer : this.$inner,
              leadZero = what === 'minute';           

          $cells.each(function(i){
            var v = values[i];
            if(leadZero && v < 10) {
              v = '0' + v;
            }
            $(this).text(v);
          });
        },          

        /*
        Click cell handler.
        Stores hour/minute and highlights.
        On second click deselect value
        */
        click: function(e) {
          var $target = $(e.target),
              value = parseInt($target.text(), 10);
          if($target.hasClass('inner')) {
            this.setHour(value !== this.hour ? value : null);
          } else {
            this.setMinute(value !== this.minute ? value : null);
          }
        },

        /*
        Click handler on ampm link
        */
        clickAmPm: function(e) {
           e.preventDefault();
           //toggle am/pm
           this.setAmPm(this.ampm === 'am' ? 'pm' : 'am');
        },
        
        /*
        Parse format from options and set this.is24
        */
        parseFormat: function() {
          var format = this.options.format,
              hFormat = 'HH',
              mFormat = 'mm';

          //hour format    
          $.each(['HH', 'hh', 'H', 'h'], function(i, f){
            if(format.indexOf(f) !== -1) {
              hFormat = f;
              return false;
            }
          });

          //minute format
          $.each(['mm', 'm'], function(i, f){
            if(format.indexOf(f) !== -1) {
              mFormat = f;
              return false;
            }
          });          

          //is 24 hour format
          this.is24 = hFormat.indexOf('H') !== -1; 

          this.hFormat = hFormat;
          this.mFormat = mFormat;
        },

        /*
        Parse value passed as string or Date object
        */
        parseTime: function(value) {
          var d = new Date(),
              hour = d.getHours(), 
              minute = 0, 
              ampm = 'am', 
              reg, parts, sep;

          if(value instanceof Date) {
            hour = value.getHours();
            minute = value.getMinutes();
          } else if(typeof value === 'string' && value.length) {
            //try take additional separator from format
            sep = this.options.format.match(/h([^hm]?)m/i);
            if(sep && sep.length && sep[1] !== ':') {
              sep = '[:\\\\'+sep[1]+']?';
            } else {
              sep = ':?';
            }
    
            //parse from string
            //use reversed string and regexp to parse 2-digit minutes first
            //see http://stackoverflow.com/questions/141348/what-is-the-best-way-to-parse-a-time-into-a-date-object-from-user-input-in-javas
            value = value.trim().split('').reverse().join('');
            reg = new RegExp('(a|p)?\\s*((\\d\\d)' + sep + ')?(\\d\\d?)', 'i');
            parts = value.match(reg);
            if(parts.length) {
                hour = parts[4] ? parseInt(parts[4].split('').reverse().join(''), 10) : null;
                minute = parts[3] ? parseInt(parts[3].split('').reverse().join(''), 10): null;
                ampm = (!parts[1] || parts[1].toLowerCase() === 'a') ? 'am' : 'pm';
            }
          } 

          return {hour: hour, minute: minute, ampm: ampm};
        },

        /*
        Returns time as string in specified format
        */
        getTime: function() {
          var hour = this.hour,
              minute = this.minute,
              result = this.options.format;

          if(this.hFormat.length > 1 && hour < 10) {
            hour = '0' + hour;
          }   

          if(this.mFormat.length > 1 && minute < 10) {
            minute = '0' + minute;
          }

          result = result.replace(this.hFormat, hour).replace(this.mFormat, minute);
          if(!this.is24) {
            if(result.indexOf('A') !== -1) {
               result = result.replace('A', this.ampm.toUpperCase());
            } else {
               result = result.replace('a', this.ampm);
            }
          }

          return result;
        },

        /*
        Set time of clockface. Am/pm will be set automatically.
        Value can be Date object or string
        */
        setTime: function(value) {
            //parse value
            var res = this.parseTime(value);

            //'24' always '0'
            if(res.hour === 24) {
              res.hour = 0;
            }

            //try to set ampm automatically
            if(res.hour > 11 && res.hour < 24) {
              res.ampm = 'pm';
              //for 12h format correct value 
              if(!this.is24 && res.hour > 12) {
                res.hour -= 12;
              }
            } else if(res.hour >= 0 && res.hour < 11) {
              //always set am for 24h and for '0' in 12h 
              if(this.is24 || res.hour === 0) {
                 res.ampm = 'am';
              } 
              //otherwise ampm should be defined in value itself and stored in res when parsing
            }      

            this.setAmPm(res.ampm);
            this.setHour(res.hour);
            this.setMinute(res.minute);
        }
    };

    $.fn.clockface = function ( option ) {
        var args = Array.apply(null, arguments);
        args.shift();
        return this.each(function () {
            var $this = $(this),
            data = $this.data('clockface'),
            options = typeof option == 'object' && option;
            if (!data) {
                $this.data('clockface', (data = new Clockface(this, options)));
            }
            if (typeof option == 'string' && typeof data[option] == 'function') {
                data[option].apply(data, args);
            }
        });
    };  
    
    $.fn.clockface.defaults = {
        //see http://momentjs.com/docs/#/displaying/format/
        format: 'H:mm',
        am: 'AM',
        pm: 'PM'
    };
   

 $.fn.clockface.template = ''+
      '<div class="clockface">' +
          '<div class="l1">' +
              '<div class="cell"></div>' +
              '<div class="cell"></div>' +
              '<div class="cell"></div>' +
          '</div>' +
          '<div class="l2">' +
                '<div class="cell left"></div>' +
                '<div class="cell right"></div>' +
          '</div>'+
          '<div class="l3">' +
                '<div class="cell left"></div>' +
                '<div class="cell right"></div>' +
                '<div class="center"><a href="#" class="ampm"></a></div>' +
          '</div>'+
          '<div class="l4">' +
                '<div class="cell left"></div>' +
                '<div class="cell right"></div>' +
          '</div>'+
          '<div class="l5">' +
                '<div class="cell"></div>' +
                '<div class="cell"></div>' +
                '<div class="cell"></div>' +
          '</div>'+
      '</div>';  

}(window.jQuery));