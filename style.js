
function Student(name, birthday) {
    this.name = name
    this.birthday = birthday
    this.id = new Date().toISOString()
}

function Store() { }

Store.prototype.getStudents = function () {
    return JSON.parse(localStorage.getItem("students")) || []
}

Store.prototype.add = function (student) {

    const students = this.getStudents()
    students.push(student)
    localStorage.setItem("students", JSON.stringify(students))
}

Store.prototype.getStudent = function (id) {

    let students = this.getStudents()
    return students.find(student => student.id === id)
}
Store.prototype.remove = function (id) {
    let students = this.getStudents()
    let indexRemove = students.findIndex(student => student.id === id)
    students.splice(indexRemove, 1)

    localStorage.setItem("students", JSON.stringify(students))
}




function RenderUI() { }
RenderUI.prototype.add = function (student) {
    const newTr = document.createElement("tr")
    const students = new Store().getStudents()
    newTr.innerHTML = `
        <td>${students.length}</td>
        <td>${student.name}</td>
        <td>${student.birthday}</td>
        <td>
            <button class="btn btn-danger btn-sm btn-remove"
                    data-id="${student.id}">
                    Xóa
            </button>
        </td>
    `

    document.querySelector("tbody").appendChild(newTr)
    document.querySelector("#name").value = ""
    document.querySelector("#birthday").value = ""
}


RenderUI.prototype.alert = function (msg, type = "success") {
    const divAlert = document.createElement("div")
    divAlert.className = `alert alert-${type}`
    divAlert.innerHTML = msg
    document.querySelector("#notification").appendChild(divAlert)

    setTimeout(() => {
        divAlert.remove()
    }, 2000)
}

RenderUI.prototype.renderAll = function () {
    const students = new Store().getStudents();
    let htmlContent = students.reduce((total, studentCurrent, currentIndex) => {
        return total + `
        <tr>
            <td>${currentIndex + 1}</td>
            <td>${studentCurrent.name}</td>
            <td>${studentCurrent.birthday}</td>
            <td>
                <button class="btn btn-danger btn-sm btn-remove" data-id="${studentCurrent.id}">Xóa</button>
            </td>
        </tr>
        `;
    }, "");
    document.querySelector("tbody").innerHTML = htmlContent
};

document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault()

    const store = new Store()
    const ui = new RenderUI()
    const name = document.querySelector("#name").value
    const birthday = document.querySelector("#birthday").value

    let newStudent = new Student(name, birthday)
    store.add(newStudent)
    ui.add(newStudent)
    ui.alert(`Bạn vừa thêm thành công ${name}`)
})

document.addEventListener("DOMContentLoaded", (event) => {
    const ui = new RenderUI()
    ui.renderAll()
})


document.querySelector("tbody").addEventListener("click", event => {
    if (event.target.classList.contains("btn-remove")) {
        const idRemove = event.target.dataset.id

        const store = new Store()
        const ui = new RenderUI()
        const student = store.getStudent(idRemove)
        const isConfirmed = confirm(`Bạn có chắc là muốn xóa ${student.name}`)

        if (isConfirmed) {
            store.remove(idRemove)
            ui.renderAll()
            ui.alert(`Bạn đã xóa thành công ${student.name}`)
        }
    }
})

