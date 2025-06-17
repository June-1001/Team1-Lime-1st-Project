var tab = "<table>"
var arr_all = []
var size = 0
var arr_H = []
var arr_V = []
var score = []

document.addEventListener("contextmenu", function (even) {
    even.preventDefault()
})

const numberInput = document.getElementById('numberInput')
const subitButton = document.getElementById('subitButton')
subitButton.addEventListener('click', () => {
    size = Number(numberInput.value)
    start()
})

function start() {
    arr_all = []
    arr_H = []
    arr_V = []
    score = []
    tab = "<table>"
    for (um = 0; um < size; um++) {
        var arr = []
        for (num = 0; num < size; num++) {
            arr.push(0)
        } score.push(arr)
    }
    function space(pas) {
        return pas.split('').join(' ')
    }

    for (num = 0; num < size; num++) {
        var arr = []
        for (nom = 0; nom < size; nom++) {
            var rand = Math.floor(Math.random() * 2)
            arr.push(rand)
        }
        arr_all.push(arr)
    }
    for (on = 0; on < arr_all.length; on++) {
        var kok = ""
        var num = 0
        for (nok = 0; nok < size; nok++) {
            var op = arr_all[on][nok]
            if (op > 0) {
                num += 1
            } else {
                if (num > 0) {
                    kok += num
                    num = 0
                }
            }
        } if (num > 0) {
            kok += num
        }
        arr_H.push(kok)
    }
    for (mon = 0; mon < arr_all.length; mon++) {
        var ko = ""
        var num = 0
        for (non = 0; non < size; non++) {
            var op = arr_all[non][mon]
            if (op > 0) {
                num += 1
            }
            else {
                if (num > 0) {
                    ko += num
                    ko += "<br>"
                    num = 0
                }
            }
        }
        if (num > 0) {
            ko += num
            ko += "<br>"
        }
        arr_V.push(ko)
    }

    tab += "<tr>"
    tab += "<th class='hot'>" + "</th>"
    for (kom = 0; kom < size; kom++) {
        tab += "<th class='cot'>" + arr_V[kom] + "</th>"
    }
    tab += "</tr>"
    for (mo = 0; mo < size; mo++) {
        tab += "<tr>"
        tab += "<th class='hot'>" + space(arr_H[mo]) + "</th>"
        for (po = 0; po < size; po++) {
            tab += "<td class='but'>"
            tab += `<button class='tot' onmousedown='put(event, ${mo}, ${po})'></button>`;
            tab += "</td>"
        } tab += "</tr>"
    }

    tab += "</table>"
    area.innerHTML = tab
}
function win_or_lose() {
    var score_H = []
    for (on = 0; on < score.length; on++) {
        var kok = ""
        var num = 0
        for (nok = 0; nok < size; nok++) {
            var op = score[on][nok]
            if (op > 0) {
                num += 1
            } else {
                if (num > 0) {
                    kok += num
                    num = 0
                }
            }
        } if (num > 0) {
            kok += num
        }
        score_H.push(kok)
    }
    var score_V = []
    for (mon = 0; mon < score.length; mon++) {
        var ko = ""
        var num = 0
        for (non = 0; non < size; non++) {
            var op = score[non][mon]
            if (op > 0) {
                num += 1
            }
            else {
                if (num > 0) {
                    ko += num
                    ko += "<br>"
                    num = 0
                }
            }
        }
        if (num > 0) {
            ko += num
            ko += "<br>"
        }
        score_V.push(ko)
    }
    if (JSON.stringify(arr_H) === JSON.stringify(score_H) && JSON.stringify(arr_V) === JSON.stringify(score_V)) {
        alert("승리!")
    }
}
function put(event, mop, pop) {
    let bot = event.target
    if (event.button === 0) {
        if (score[mop][pop] < 1) {
            score[mop][pop] += 1
            bot.classList.add("clicked")
            bot.classList.remove("not")
        } else {
            score[mop][pop] = 0
            bot.classList.remove("clicked")
        }
    } else if (event.button === 2) {
        bot.classList.remove("clicked")
        score[mop][pop] = 0
        bot.classList.toggle("not")
    }
    win_or_lose()
}