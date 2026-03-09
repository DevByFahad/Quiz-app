const taskInput = document.getElementById("taskInput")
const addBtn = document.getElementById("addTaskBtn")
const taskList = document.getElementById("taskList")
const emptyState = document.getElementById("emptyState")
const counter = document.getElementById("taskCounter")
const clearBtn = document.getElementById("clearCompleted")

let tasks = []

/* Load saved tasks */

document.addEventListener("DOMContentLoaded", () => {

    const saved = localStorage.getItem("tasks")

    if (saved) {

        tasks = JSON.parse(saved)

        renderTasks()

    }

})

/* Add task */

addBtn.addEventListener("click", addTask)

taskInput.addEventListener("keypress", e => {

    if (e.key === "Enter") addTask()

})

function addTask() {

    const text = taskInput.value.trim()

    if (text === "") return

    const task = {

        id: Date.now(),

        text: text,

        completed: false

    }

    tasks.push(task)

    taskInput.value = ""

    saveTasks()

    renderTasks()

}

/* Render tasks */

function renderTasks() {

    taskList.innerHTML = ""

    if (tasks.length === 0) {

        emptyState.style.display = "block"

    }

    else {

        emptyState.style.display = "none"

    }

    /* Move completed tasks to bottom */

    tasks.sort((a, b) => a.completed - b.completed)

    tasks.forEach(task => {

        const li = document.createElement("li")

        li.className = "task"

        if (task.completed) {

            li.classList.add("completed")

        }

        const left = document.createElement("div")

        left.className = "task-left"

        /* checkbox */

        const checkbox = document.createElement("input")

        checkbox.type = "checkbox"

        checkbox.checked = task.completed

        checkbox.addEventListener("change", () => {

            task.completed = !task.completed

            saveTasks()

            renderTasks()

        })

        /* text */

        const span = document.createElement("span")

        span.textContent = task.text

        span.contentEditable = true

        span.addEventListener("blur", () => {

            task.text = span.textContent.trim()

            saveTasks()

        })

        left.appendChild(checkbox)

        left.appendChild(span)

        /* actions */

        const actions = document.createElement("div")

        actions.className = "actions"

        /* delete */

        const del = document.createElement("button")

        del.textContent = "Delete"

        del.addEventListener("click", () => {

            tasks = tasks.filter(t => t.id !== task.id)

            saveTasks()

            renderTasks()

        })

        actions.appendChild(del)

        li.appendChild(left)

        li.appendChild(actions)

        taskList.appendChild(li)

    })

    updateCounter()

}

/* Counter */

function updateCounter() {

    const total = tasks.length

    const completed = tasks.filter(t => t.completed).length

    counter.textContent = `${completed} / ${total} Completed`

}

/* Clear completed */

clearBtn.addEventListener("click", () => {

    tasks = tasks.filter(task => !task.completed)

    saveTasks()

    renderTasks()

})

/* Save */

function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks))

}