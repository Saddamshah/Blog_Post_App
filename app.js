const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

//APP CONFIG
mongoose.connect('mongodb://localhost/Rest_blog_app', { useNewUrlParser: true })
app.use(bodyParser.urlencoded({extended: true}))
mongoose.set( 'useFindAndModify', false )
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.set('view engine', 'ejs')

//MONGOOSE/MODEL CONFIG
const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
})
const Blog = mongoose.model('Blog', blogSchema)

// Blog.create({
//     title: 'Saddam Shah',
//     image: 'https://images.unsplash.com/photo-1562336820-bf026e805e30?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
//     body: 'This is a beutiful Post app and yes this is created by me.'
// })

//ROUTES
app.get('/', (req,res) => {
    res.redirect('/blogs')
})

//index Route
app.get('/blogs', (req, res) => {
    Blog.find({}, (err , data) => {
        (err) ? console.log(err) : res.render('index', {blogs: data})
    })
})

//New Route
app.get('/blogs/new', (req, res) => {
    res.render('new')
})

//Create Route
app.post('/blogs', (req, res) => {
    Blog.create(req.body.blog,(err, data) => {
        (err) ? console.log(err) : res.redirect('/blogs')
    } )
})

//Show Route
app.get('/blogs/:id', (req, res) => {
    Blog.findById(req.params.id, (err, data) => {
        (err) ? res.redirect('/blogs') : res.render('show', {blog : data})
    })
})

//Edit Route
app.get('/blogs/:id/edit', (req, res) => {
    Blog.findById(req.params.id, (err, data) => {
        (err) ? res.redirect('/blogs') : res.render('edit', {blog: data})
    })
})

//Update Route
app.put('/blogs/:id', (req, res) => {
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, data) => {
        (err) ? res.redirect('/blogs') : res.redirect('/blogs/' + req.params.id)
    })
})

//Delete Route
app.delete('/blogs/:id', (req, res) => {
    Blog.findByIdAndRemove(req.params.id, (err) => {
        (err) ? console.log(err) : res.redirect('/blogs')
    })
})  

app.listen(port, () => console.log('Server is started'))


