const fs = require("fs")

const { age, graduation, date } = require("../utils")
const data = require("../data.json")

exports.index = function(req, res){
    return res.render("teachers/index", { teachers: data.teachers })
}

exports.create = function(req, res){
    return res.render("teachers/create")
}

exports.post = function(req, res){
    
    const keys = Object.keys(req.body)

    for(key of keys){
        if(req.body[key] == "")
            return res.send("Please fill all the required fields!")
    }

    let { avatar_url, name, birth, formation, class_type, subjects } = req.body

    birth = Date.parse(birth)
    const lastTeacher = data.teachers[data.teachers.length - 1]
    const id = lastTeacher ? lastTeacher.id + 1 : 1
    const created_at = Date.now()

    data.teachers.push({
        id,
        avatar_url,
        name,
        birth,
        formation,
        class_type,
        subjects,
        created_at
    })

    fs.writeFile("data.json", JSON.stringify(data, null, 4), function(err){
        if(err) return res.send("Write file error!")

        return res.redirect("/teachers")
    })
}

exports.show = function(req, res){
    const { id } = req.params

    const foundTeacher = data.teachers.find(function(teacher){
        return teacher.id == id
    })

    if(!foundTeacher) return res.send("Teacher not found!")

    const teacher = {
        ...foundTeacher,
        age: age(foundTeacher.birth),
        formation: graduation(foundTeacher.formation),
        subjects: foundTeacher.subjects.split(","),
        created_at: new Intl.DateTimeFormat("pt-BR").format(foundTeacher.created_at)
    }

    return res.render("teachers/show", { teacher })

}

exports.edit = function(req, res){
    const { id } = req.params

    const foundTeacher = data.teachers.find(function(teacher){
        return teacher.id == id
    })

    if(!foundTeacher) return res.send("Teacher not found!")

    const teacher = {
        ...foundTeacher,
        birth: date(foundTeacher.birth).iso
    }

    return res.render("teachers/edit", { teacher })
}

exports.update = function(req, res){
    const { id } = req.body
    let index = 0

    const foundTeacher = data.teachers.find(function(teacher, foundIndex){
        if(teacher.id == id){
            index = foundIndex
            return true
        }
    })

    if(!foundTeacher) return res.send("Teacher not found!")

    const teacher = {
        ...foundTeacher,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }

    data.teachers[index] = teacher

    fs.writeFile("data.json", JSON.stringify(data, null, 4), function(err){
        if(err) return res.send("Write file error!")

        return res.redirect(`teachers/${id}`)
    })
}

exports.delete = function(req, res){
    const { id } = req.body

    const filteredTeachers = data.teachers.filter(function(teacher){
        return teacher.id != id
    })

    data.teachers = filteredTeachers

    fs.writeFile("data.json", JSON.stringify(data, null, 4), function(err){
        if(err) return res.send("Write file error!")

        return res.redirect("/teachers")
    })
}
