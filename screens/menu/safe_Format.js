export const months_th = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",];
export const months_th_mini = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",];
export const monthFormat = (month) => {
    return months_th[Number(month) - 1];
}
export const currencyFormat = (num) => {
    return Number(num).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

export const dateFormat = (date) => {
    return date.substring(0, 4) + '/' + date.substring(4, 6) + '/' + date.substring(6, 8)
}
export const setnewdateF = (date) => {
    var x = new Date(date);

    var day = x.getDate()
    if (day < 10)
        day = '0' + day.toString()

    var month = x.getMonth() + 1
    if (month < 10)
        month = '0' + month.toString()

    var year = x.getFullYear()
    return year + '' + month + '' + day
}
 