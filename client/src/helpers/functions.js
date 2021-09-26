export const formataData = (data, withHours = false) => {
    const date = new Date(data)

    let y = date.getFullYear(),
        m = date.getMonth() + 1,
        d = date.getDate()

    m = m > 10 ? m : '0' + m
    d = d > 10 ? d : '0' + d

    if (withHours) {
        let hor = date.getHours(),
            min = date.getMinutes(),
            sec = date.getSeconds()

        hor = hor > 10 ? hor : '0' + hor
        min = min > 10 ? min : '0' + min
        sec = sec > 10 ? sec : '0' + sec

        return `${d}/${m}/${y} às ${hor}:${min}:${sec}`

    } else {
        return `${d}/${m}/${y}`
    }
}