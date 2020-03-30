import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dateFilter'
})
export class DateFilterPipe implements PipeTransform {

    transform(data, date): any {
	if (!data)
	    return data;

	console.log(date);
	
	if (date.begin != '' || date.end != '') {
	    if (date.end == '')
		return data.filter(item => (item.mealDate >= date.begin));
	    if (date.begin == '')				       
		return data.filter(item => (item.mealDate <= date.end));
				   
	    return data.filter(item => (item.mealDate >= date.begin && item.mealDate <= date.end));
	}
	else
	    return data;

    }

}
