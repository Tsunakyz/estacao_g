const express = require('express')
const app = express()
const mysql = require('mysql')
const cors = require('cors')

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'estacao_g'
})

app.use(cors())
app.use(express.json())

// -- START AUTHORS -- \\

app.get('/getAuthors', (req, res) => {
    const sql = `SELECT * FROM authors ORDER BY id desc`

    db.query(sql, (err, result) => {
        res.json(result)
    })
})

app.post('/addAuthor', (req, res) => {
    const { name } = req.body

    const sql = `INSERT INTO authors (name) VALUES ('${name || ''}')`

    db.query(sql, (err, result) => {
        res.json(result)
    })
})

app.delete('/deleteAuthor', (req, res) => {
    const { id } = req.body

    const sql = `DELETE FROM authors WHERE authors.id = ${id}`

    db.query(sql, (err, result) => {
        res.json(result)
    })
})

// -- END AUTHORS -- \\

// -- START CATEGORIES -- \\

app.get('/getCategories', (req, res) => {
    const sql = `SELECT * FROM categories ORDER BY id desc`

    db.query(sql, (err, result) => {
        res.json(result)
    })
})

app.post('/addCategory', (req, res) => {
    const { name } = req.body

    const sql = `INSERT INTO categories (name) VALUES ('${name || ''}')`

    db.query(sql, (err, result) => {
        res.json(result)
    })
})

app.delete('/deleteCategory', (req, res) => {
    const { id } = req.body

    const sql = `DELETE FROM categories WHERE categories.id = ${id}`

    db.query(sql, (err, result) => {
        res.json(result)
    })
})

// -- END CATEGORIES -- \\

// -- START NOTICES -- \\

app.post('/addNotice', (req, res) => {
    const { title, content, subtitle, category, author } = req.body

    const sql = `INSERT INTO notices (title, content, subtitle, id_category, id_author) VALUES ('${title}', '${content}', '${subtitle || ''}', ${category}, ${author})`

    db.query(sql, (err, result) => {
        res.json(result)
    })
})

app.get('/getNotices', (req, res) => {
    const sql = `
        SELECT 
            notices.*,
            categories.name AS category_name,
            authors.name AS author_name
        FROM 
            notices
        INNER JOIN 
            categories ON categories.id = notices.id_category
        INNER JOIN 
            authors ON authors.id = notices.id_author
        ORDER BY 
            notices.id desc
    `

    db.query(sql, (err, result) => {
        res.json(result)
    })
})

app.get('/getNoticeById', (req, res) => {
    const { id } = req.query
    
    const sql = `
        SELECT 
            notices.*
        FROM 
            notices
        WHERE
            id = ${id}
    `

    db.query(sql, (err, result) => {
        res.json(result)
    })
})

app.delete('/deleteNotice', (req, res) => {
    const { id } = req.body
    
    const sql = `DELETE FROM notices WHERE notices.id = ${id}`

    db.query(sql, (err, result) => {
        res.json(result)
    })
})

app.put('/updateNotice', (req, res) => {
    const { title, content, subtitle, category, author, id } = req.body

    const sql = `
        UPDATE  
            notices
        SET 
            title = '${title}',
            subtitle = '${subtitle}',
            content = '${content}',
            id_category = ${category},
            id_author = ${author}
        WHERE
            id = ${id}
    `
    db.query(sql, (err, result) => {
        res.json(result)
    })
})

app.listen(3001, () => {
    console.log('server online')
})