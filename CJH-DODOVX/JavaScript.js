var tab = "<table>"
var arr_all = []
var size = 5
var arr_H = []
var arr_V = []
var score = []
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
        tab += "<td class='but'>" + "<button id='butt'>" + "</button>" + "</td>"
    } tab += "</tr>"
}

tab += "</table>"
area.innerHTML = tab
console.log(tab)
document.getElementById("butt").addEventListener('click',put)
function put() {
    if (score[1][1] < 1){
    score[1][1] += 1} else {
        score[1][1] = 0
    }console.log(score)
}
// console.log(end_score)
// document.querySelectorAll('#area td')
//     .forEach(e => e.addEventListener("click", function () {
//         td = this.children
//         if (2 >= this.innerHTML > 1) {

//         }
//         if (2 > this.innerHTML > 0) {
//             score += 1
//             console.log(score)

//             if (score >= end_score) {
//                 alert("승리입니다.")
//             }
//         } else { alert("패배입니다.") }
//     }))