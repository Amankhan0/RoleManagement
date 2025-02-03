export const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
};


export const ObjIsEmpty = (obj: object): boolean => Object.keys(obj).length === 0;


export const getFullYear = (UNIX_timestamp:number|string) => {
    var a = new Date(typeof(UNIX_timestamp) === 'string'?parseInt(UNIX_timestamp):UNIX_timestamp);
    var months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + '-' + month + '-' + year;
    return time;
}

export const getFullYearWithTime = (UNIX_timestamp:number|string) => {
    var a = new Date(typeof(UNIX_timestamp) === 'string'?parseInt(UNIX_timestamp):UNIX_timestamp);
    var months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JULY', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var suffix = hour >= 12 ? "PM" : "AM";
    var hours = ((hour + 11) % 12 + 1)
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + '-' + month + '-' + year + ', ' + hours + ':' + min + ' ' + suffix;
    return time;
}