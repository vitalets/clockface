/**
Watch-like timepicker
**/
(function ($) {

    var Watch = function (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, $.fn.watch.defaults, options);
        this.init();  
     };

    Watch.prototype = {
        constructor: Watch, 
        init: function () {
          var that = this;

          //iquery objects
          this.$watch = $($.fn.watch.template);
          this.$cells = this.$watch.find('.cell'); 
          this.$hour = this.$watch.find('input[name="hour"]'); 
          this.$minute = this.$watch.find('input[name="minute"]'); 
          this.$am = this.$watch.find('.am');
          this.$pm = this.$watch.find('.pm');

          //intial values
          //this.hour = null;
          //this.minute = null;
          
          this.parseFormat();

          this.hours = [11, 0, 1, 10, 2, 9, 3, 8, 4, 7, 6, 5];
          this.minutes = [55, 0, 5, 50, 10, 45, 15, 40, 20, 35, 30, 25];

          if(this.is24) {
             this.$pm.text('12-23');
             this.$am.text('0-11').css('margin-left', '4px');
          } 

          //click am/pm 
          this.$am.click($.proxy(this.clickAmPm, this));
          this.$pm.click($.proxy(this.clickAmPm, this));

          //click cell
          this.$watch.on('click', '.cell', $.proxy(this.clickCell, this));

          //focus + keyup hour
          this.$hour.focus($.proxy(this.focusHour, this))
                    .keyup($.proxy(this.keyupHour, this));

          //focus minute 
          this.$minute.focus($.proxy(this.focusMinute, this));


          this.isInline = this.$element.is('div');
         
        },

        show: function() {
            if(this.isInline) {
                this.$element.append(this.$watch);
            }

            var h = 23, m = 30;
            
            this.setAmPm('pm');
            this.fill('hour24');

            this.$hour.val(h).focus();
            this.$minute.val(m);
        },

        /*
        Just fill any values around watch
        */ 
        fillValues: function(values, leadZero, offset) {
          offset = offset || 0;
          this.$cells.each(function(i){
            var v = values[i] + offset;
            if(leadZero && v < 10) {
              v = '0' + v;
            }
            $(this).text(v);
          });
        },

        /*
        Fill hours or minutes around watch due to viewmode
        */ 
        fill: function(viewmode) {
          if(this.viewmode === viewmode) {
            return;
          } else {
            this.viewmode = viewmode;
          }

          if(viewmode === 'minute') {
            this.fillValues(this.minutes, this.mFormat.length > 1, 0);
          } else if(viewmode === 'hour12') {
            this.fillValues(this.hours, false, 0);
          } else if(viewmode === 'hour24') {
            this.fillValues(this.hours, false, 12);
          }
        },      

        /*
        Click handler on ampm links
        Highlights ampm and set focus back on input. Focus will automatically re-fill values if needed.
        */
        clickAmPm: function(e) {
           e.preventDefault();
           this.setAmPm($(e.target).hasClass('am') ? 'am' : 'pm');

           if(this.viewmode === 'minute') {
              this.$minute.focus(); 
           } else {
              this.$hour.focus();
           }
        },
        /*
        Click cell handler.
        Writes new value and set focus. Focus will automatically highlight cell.
        */
        clickCell: function(e) {
          if(this.viewmode === 'minute') {
            this.$minute.val($(e.target).text()).focus();
          } else {
            this.$hour.val($(e.target).text()).focus();
          } 
        },

        /*
        Focus hour handler. Does not chnage ampm.
        It just fills values and highlights hour
        */
        focusHour: function() {
            var viewmode = (this.is24 && this.ampm === 'pm') ? 'hour24' : 'hour12';
            this.fill(viewmode);
            this.highlightHour();
        },

        /*
        Keyup hour handler.
        */
        keyupHour: function() {
          clearTimeout(this.timerH);
          this.timerH = setTimeout($.proxy(this.setHour, this), 400);
        }, 

        /*
        Read hour from input and highlight it if possible
        */
        highlightHour: function() {
            var value = parseInt(this.$hour.val(), 10),
            index;

            //if watch filled with 24h modify value for correct search in this.hours 
            if(this.viewmode === 'hour24') {
              value -= 12;
            }

            index = $.inArray(value, this.hours);
            this.highlight(index);
        },  

        /*
        if value not defined it will be read from input.
        Force viewmode (and ampm if 24h)
        */
        setHour: function(value) {
            var viewmode = 'hour12';

            clearTimeout(this.timerH);

            if(value === undefined) {
              value = this.$hour.val();
            } else {
              this.$hour.val(value);
            }

            value = parseInt(value, 10);
           
            if(this.is24) {
                //set viewmode
                viewmode = (value > 11) ? 'hour24' : 'hour12';              
                //set ampm
                this.setAmPm(viewmode === 'hour12' ? 'am' : 'pm'); 
            }

            this.fill(viewmode);
            this.highlightHour();            
        },              

        /*
        Fous minute handler.
        It just fills values and highlights minute
        */
        focusMinute: function() {
            this.fill('minute');
            this.highlightMinute();
        },

        /*
        Keyup minute handler.
        */
        keyupMinute: function() {
          clearTimeout(this.timerM);
          this.timerM = setTimeout($.proxy(this.setMinute, this), 400);
        }, 

        /*
        Read minute from input and highlight it
        */
        highlightMinute: function() {
            var value = parseInt(this.$minute.val(), 10),
                index = $.inArray(value, this.minutes);
            this.highlight(index);
        },    

        /*
        if value not defined it will be read from input.
        Force viewmode
        */
        setMinute: function(value) {
            clearTimeout(this.timerM);

            if(value !== undefined) {
              this.$minute.val(value);
            }

            this.fill('minute');
            this.highlightMinute();            
        },            

        /*
        Highlight cell in watch by index
        */
        highlight: function(index) {
          this.$cells.filter('.active').removeClass('active');

          if(index >= 0) {
            this.$cells.eq(index).addClass('active');
          }
        },
    
        /*
        Highlight am / pm links
        */
        setAmPm: function(value) {
          if(value === this.ampm) {
             return;
          } else {
             this.ampm = value;
          }

          if(this.ampm === 'am') {
            this.$pm.removeClass('active');
            this.$am.addClass('active');
          } else {
            this.$pm.addClass('active');
            this.$am.removeClass('active');
          }
        },
       
        parseTime: function(value) {

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
        }
    };

    $.fn.watch = function ( option ) {
        var args = Array.apply(null, arguments);
        args.shift();
        return this.each(function () {
            var $this = $(this),
            data = $this.data('watch'),
            options = typeof option == 'object' && option;
            if (!data) {
                $this.data('watch', (data = new Watch(this, options)));
            }
            if (typeof option == 'string' && typeof data[option] == 'function') {
                data[option].apply(data, args);
            }
        });
    };  
    
    $.fn.watch.defaults = {
        //see http://momentjs.com/docs/#/displaying/format/
        format: 'H:mm'
    };
   

 $.fn.watch.template = ''+
      '<div class="watch">' +
          '<div class="l1">' +
              '<div class="cell"></div>' +
              '<div class="cell"></div>' +
              '<div class="cell"></div>' +
          '</div>' +
          '<div class="l2">' +
                '<div class="cell left"></div>' +
                '<div class="cell right"></div>' +
                '<div class="center"><a href="#" class="am active">am</a><a href="#" class="pm">pm</a></div>' +
          '</div>'+
          '<div class="l3">' +
                '<div class="cell left"></div>' +
                '<div class="cell right"></div>' +
                '<div class="center"><input type="text" name="hour" maxlength="2"><span>:</span><input type="text" name="minute" maxlength="2"></div>' +
          '</div>'+
          '<div class="l4">' +
                '<div class="cell left"></div>' +
                '<div class="cell right"></div>' +
                '<div class="center"><a href="#" class="now">now</a></div>' +
          '</div>'+
          '<div class="l5">' +
                '<div class="cell"></div>' +
                '<div class="cell"></div>' +
                '<div class="cell"></div>' +
          '</div>'+
      '</div>';  

/*
    $.fn.watch.template = ''+
      '<div class="watch">' +
          '<div class="top">' +
              '<div class="cell"></div>' +
              '<div class="cell"></div>' +
              '<div class="cell"></div>' +
          '</div>' +
          '<div class="middle">' +
              '<div class="left">' +
                  '<div class="cell"></div>' +
                  '<div class="cell center"></div>' +
                  '<div class="cell"></div>' +
              '</div>' +
              '<div class="right">' +
                  '<div class="cell"></div>' +
                  '<div class="cell center"></div>' +
                  '<div class="cell"></div>' +
              '</div>' +
              '<div class="center">'+
                  '<div class="controls">'+
                     '<div><a href="#" class="am active">am</a><a href="#" class="pm">pm</a></div>' +
                     '<div><input type="text" name="hour" maxlength="2">:<input type="text" name="minute" maxlength="2"></div>' +
                     '<div><a href="#" class="now">now</a></div>' +
                  '</div>' +
              '</div>' +
          '</div>' +
          '<div class="bottom">' +
              '<div class="cell"></div>' +
              '<div class="cell center"></div>' +
              '<div class="cell"></div>' +
          '</div>' +  
      '</div>';  
*/


}(window.jQuery));