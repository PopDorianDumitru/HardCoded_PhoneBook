const { json } = require('express');
const express = require('express');
const morgan = require('morgan');

morgan.token('fullstack', (request) =>{
   return JSON.stringify(request.body);
})

const app = express();
app.use(express.json());

/*const requestLogger = (request, response, next) =>{
    console.log("METHOD: ", request.method);
    console.log('Path: ', request.path);
    console.log('Body: ', request.body);
    console.log('---');

    next();
}*/


///app.use(requestLogger);
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :fullstack '));
let persons = [
    { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
      },
      { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
      },
      { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
      },
      { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
      }
]

app.get('/', (request, response) =>{
    response.send("<h1>Just playing around with express and postman</h1>")
})

app.get('/api/persons', (request, response)=>{
    response.json(persons);
})

app.get('/info', (request, response) =>{
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>`);

})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);
    if(!person)
        return response.status(404).end();
    
    response.json(person);
    
})

app.delete('/api/persons/:id', (request, response) =>{
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id);
    response.status(204).end();
})

app.post('/api/persons', (request, response) =>{
    const body = request.body;
    console.log(body);
    if(!body.number)
        return response.status(400).json({error: "content missing"});




    const generateId = () =>{
        return Math.floor(Math.random()*10000);
    }
    
    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    const unique_name = persons.find(p=>p.name ===person.name);
    if(unique_name)
        return response.status(400).json({error: "Name is not unique"});
    const unique_number = persons.find(p=>p.number === person.number);
    if(unique_number)
        return response.status(400).json({error: "Phone number is already in use"});
    persons = persons.concat(person);
    response.json(persons);
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint)

const PORT = 3001;
app.listen(PORT, () =>{
    console.log(`SERVER RUNNING ON ${PORT}`)
});