import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DownloadService {
    public exportAsCSV(columns, keyValues, filename='reports.csv') {
        let csvData = this.convertToCSV(keyValues, columns);
        console.log(`DownloadService.exportAsCSV()`);
        console.log(csvData);

        this.downloadFile(csvData, filename);
    }

    private downloadFile(csvData, filename) {
        let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
        let dwldLink = document.createElement("a");
        let url = URL.createObjectURL(blob);
        let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
        if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
            dwldLink.setAttribute("target", "_blank");
        }

        dwldLink.setAttribute("href", url);
        dwldLink.setAttribute("download", filename);
        dwldLink.style.visibility = "hidden";
        document.body.appendChild(dwldLink);
        dwldLink.click();
        document.body.removeChild(dwldLink);
    }

    private convertToCSV(objArray, columns) {
        console.log(`DownloadService.convertToCSV(${JSON.stringify(columns)})`);
        let str = '';
        let row = 'S.No,';
        let headerArray = columns.map(column => column.value);
        row += headerArray.join(',');
        console.log(`The Header Row[${JSON.stringify(row)}]`);
        str += row + '\r\n';
        console.log(`The Header Row[${str}]`);

        objArray.forEach( (array, index) => {
            str += `${index+1},` + array.join(',') + '\r\n'
        });
        return str;
    }
}
