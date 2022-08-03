const { query } = require('express')
const express = require('express')
const cors =require('cors')
const { Pool } = require('pg')

require('dotenv').config()

const app = express()

app.use(express.json())
app.use(cors())
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL
});


const PORT = process.env.PORT || 8001

//  usuarios

app.get('/users' , async (req, res) => {
    try{
        const { rows } = await pool.query('SELECT * FROM users')
        return res.status(200).send(rows)
    }catch(e) {
        return res.status(400).send(e)
    }
})
app.get('/user/:user_name/:passwd' , async (req, res) => {
    const {user_name, passwd} = req.params
    try{
        const exites = await pool.query('SELECT * FROM users WHERE user_name = ($1) AND passwd = ($2) ', [user_name, passwd])
        if (!exites.rows[0]) {
            return res.status(400).send('operetion is not allowed')
        }
        return res.status(200).send(exites.rows)
    }catch(e) {
        return res.status(400).send(e)
    }
})
app.post('/user', async (req, res) => {
    let { user_name, passwd, user_email } = req.body
    let user = ''
    try{
        user = await pool.query('SELECT * FROM users WHERE user_name = ($1)', [user_name])
        if(!user.rows[0]){
            user = await pool.query('INSERT INTO users(user_name, passwd, user_mail) VALUES ($1, $2, $3) RETURNING *', [user_name, passwd, user_email])
        }
        return res.status(200).send(user.rows)
    }catch(e){
        return res.status(400).send(e)
    }
})

app.patch('/user/:user_id', async (req, res) => {
    const { user_id } = req.params
    const data = req.body
    try {
        const exites = await pool.query('SELECT * FROM users WHERE user_id = ($1) ', [user_id])
        if (!exites.rows[0]) {
            return res.status(400).send('operetion is not allowed')
        }
        const updatedUser = await pool.query('UPDATE users SET user_name = ($1), passwd = ($2) WHERE user_id = ($3) RETURNING *', 
        [data.user_name, data.passwd, user_id])
        return res.status(200).send(updatedUser.rows) 
    }catch (e) {
        return res.status(400).send(e)
    }
})

app.delete('/user/:user_id', async (req, res) => {
    let { user_id } = req.params
    try {
        const deletUser = await pool.query('DELETE FROM users WHERE user_id = ($1) RETURNING *', [user_id])
        if (!deletUser.rows[0]) {
            return res.status(400).send('operetion is not allowed')
        }
        return res.status(200).send(deletUser.rows) 
    }catch (e) {
        return res.status(400).send(e)
    }
})
//  to dos 


app.post('/todo/:user_id', async ( req, res ) => {
    const { title, todo_description, todo_done } = req.body
    const { user_id } = req.params
    
    try {
        const newTodo = await pool.query('INSERT INTO todos (title, todo_description, todo_done, user_id) VALUES ($1, $2, $3, $4) RETURNING * ' ,[title, todo_description, todo_done, user_id ])
        return res.status(200).send(newTodo.rows)
    }catch(e){
        res.status(400).send(e)
        return
    }
})

app.get('/todo/:user_id' , async(req, res) => {
    const { user_id } = req.params
    try{
        let allTodos = await pool.query('SELECT * FROM todos WHERE user_id = ($1)',[user_id])
        console.log(allTodos)
        return res.status(200).send(allTodos.rows)
    }catch(e){
        return res.status(400).send(e)
    }
})

app.patch('/todo/:user_id/:todo_id', async (req, res) => {
    const { user_id, todo_id } = req.params
    const data = req.body
    console.log(data)
    try {
        const belongsToUser = await pool.query('SELECT * FROM todos WHERE user_id = ($1) AND todo_id = ($2)', [user_id, todo_id])
        if (!belongsToUser.rows[0]) {
            return res.status(400).send('operetion is not allowed')
        }
        const updatedTodo = await pool.query('UPDATE todos SET todo_description = ($1), todo_done = ($2) WHERE todo_id = ($3) RETURNING *', 
        [data.todo_description, data.todo_done, todo_id])
        return res.status(200).send(updatedTodo.rows) 
    }catch (e) {
        return res.status(400).send(e)
    }
})
app.delete('/todo/:user_id/:id', async (req, res) => {
    const { user_id, id } = req.params
    try {
        const deletTodo = await pool.query('DELETE FROM todos WHERE user_id = ($1) AND todo_id = ($2) RETURNING *', [user_id, id])
        if (!deletTodo.rows[0]) {
            return res.status(400).send('operetion is not allowed')
        }
        return res.status(200).send(deletTodo.rows) 
    }catch (e) {
        return res.status(400).send(e)
    }
})

app.listen(PORT ,() => {
    console.log(`server is running at port : ${PORT}`)
})