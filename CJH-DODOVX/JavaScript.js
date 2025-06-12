var tab = "<table border=''>"
var score = 0
var end_score = 0
var arr_all = []

for (num = 0; num < 9; num++) {
    var jo = 0
    var ju = 0
    tab += "<tr>"
    var arr = []
    for (nom = 0; nom < 9; nom++) {
        var rand = Math.floor(Math.random() * 2)
        arr.push(rand)
        ju += rand
        end_score += rand
    }
    tab += "<th class='hot'>" + ju + "</th>"
    for (nim = 0; nim < arr.length; nim++) {
        tab += "<td class='but'>" + arr[nim] + "</td>"
    }
    tab += "</tr>"
    arr_all.push(arr)
}
for (mon = 0; mon < arr_all.length; mon++) {
    var ko = 0
    for (non = 0; non < 9; non++) {
        ko += arr_all[non][mon]
    } console.log(ko)
}
tab += "</table>"
area.innerHTML = tab
console.log(end_score)
document.querySelectorAll('#area td')
    .forEach(e => e.addEventListener("click", function () {
        td = this.children
        if (this.innerHTML > 0) {
            score += 1
            console.log(score)
            if (score >= end_score) {
                alert("승리입니다.")
            }
        } else { console.log("LOSE") }
    }))