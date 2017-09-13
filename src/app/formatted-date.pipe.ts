import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formattedDate'
})
export class FormattedDatePipe implements PipeTransform {
  weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  transform(value: any, args?: any): any {

    var tempDate = this.parseDate(value);
       return this.weekdays[tempDate.getDay()] + ", " + this.months[tempDate.getMonth()] + " " + tempDate.getDate();  
  }
  parseDate(date) {
      if (typeof date === 'string') {
          date = date.replace(/\-/g, '/');
      }
      var dummyDate = new Date(date);
      if (Object.prototype.toString.call(dummyDate) === "[object Date]" && !isNaN(dummyDate.getTime())) {
          return dummyDate;
      }
      return new Date(date);
  }

}
