var tab = "<table border='1'>"

for (num = 1; num < 10; num++) {

    tab += "<tr>"
    for (nom = 1; nom < 10; nom++) {
        var rand = Math.floor(Math.random() * 2)
        tab += "<td class='but'>" + rand + "</td>"
    }
    tab += "</tr>"
}
tab += "</table>"
area.innerHTML = tab
document.querySelectorAll('#area td')
    .forEach(e => e.addEventListener("click", function () {
        td = this.children
        console.log(this.innerHTML)
    }))