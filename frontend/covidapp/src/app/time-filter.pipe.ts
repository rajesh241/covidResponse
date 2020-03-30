import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFilter'
})
export class TimeFilterPipe implements PipeTransform {

    transform(data, time): any {
	if (!data)
	    return data;

	console.log(time);
	
	if ( (time.begin != '') || (time.end != '')) {
            console.log("BOth of them dont seem tobe empty")
	    if (time.end == '')
		return data.filter(item => (item.mealTime >= time.begin));
	    if (time.begin == '')				       
		return data.filter(item => (item.mealTime <= time.end));
				   
	    return data.filter(item => (item.mealTime >= time.begin && item.mealTime <= time.end));
	}
	else{
            console.log("Both time filters are empty");
	    return data;
        }
    }

}
