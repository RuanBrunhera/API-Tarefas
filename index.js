import app from './app.js'

app.listen(3000, () => {
    let data = new Date()
    console.log(`Sistema incializado: \nInf: ${data}`)
    console.log('http://localhost:3000/')
}) 