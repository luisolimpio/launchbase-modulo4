const fs = require("fs")

const { date, grade } = require("../utils")
const data = require("../data.json")

exports.index = function(req, res){
    const students = data.students

    for(let student of students){
        student.grade = grade(student.grade)
    }
    return res.render("students/index", { students })
}

exports.create = function(req, res){
    return res.render("students/create")
}

exports.post = function(req, res){
    
    const keys = Object.keys(req.body)

    for(key of keys){
        if(req.body[key] == "")
            return res.send("Please fill all the required fields!")
    }

    birth = Date.parse(req.body.birth)
    const lastStudent = data.students[data.students.length - 1]
    const id = lastStudent ? lastStudent.id + 1 : 1

    data.students.push({
        id,
        ...req.body,
        birth
    })

    fs.writeFile("data.json", JSON.stringify(data, null, 4), function(err){
        if(err) return res.send("Write file error!")

        return res.redirect("/students")
    })
}

exports.show = function(req, res){
    const { id } = req.params

    const foundStudent = data.students.find(function(student){
        return student.id == id
    })

    if(!foundStudent) return res.send("Student not found!")

    const student = {
        ...foundStudent,
        birth: date(foundStudent.birth).birthDay,
        grade: grade(foundStudent.grade)
    }

    return res.render("students/show", { student })

}

exports.edit = function(req, res){
    const { id } = req.params

    const foundStudent = data.students.find(function(student){
        return student.id == id
    })

    if(!foundStudent) return res.send("Student not found!")

    const student = {
        ...foundStudent,
        birth: date(foundStudent.birth).iso
    }

    return res.render("students/edit", { student })
}

exports.update = function(req, res){
    const { id } = req.body
    let index = 0

    const foundStudent = data.students.find(function(student, foundIndex){
        if(student.id == id){
            index = foundIndex
            return true
        }
    })

    if(!foundStudent) return res.send("Student not found!")

    const student = {
        ...foundStudent,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }
    console.log(index)
    data.students[index] = student

    fs.writeFile("data.json", JSON.stringify(data, null, 4), function(err){
        if(err) return res.send("Write file error!")

        return res.redirect(`students/${id}`)
    })
}

exports.delete = function(req, res){
    const { id } = req.body

    const filteredStudent = data.students.filter(function(student){
        return student.id != id
    })

    data.students = filteredStudent

    fs.writeFile("data.json", JSON.stringify(data, null, 4), function(err){
        if(err) return res.send("Write file error!")

        return res.redirect("/students")
    })
}