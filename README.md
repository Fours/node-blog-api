# Getting Started
Install the dependencies and run the project
```
npm install
npm start
```

## About
This is a blog api written in node to practice and demonstrate the fundamentals of javascript and Node.js. It uses a file to store data and does not use any frameworks.

## Endpoints
Get all blog posts with optional filters
```
GET /posts
GET /posts?author=name&tags=one,two
```
Get one blog post
```
GET /posts/{id}
```
Create a new blog post
```
POST /posts

{
    "timestamp": 1763497441981,
    "author": "Alice",
    "tags": ["one", "two"],
    "blurb": "Lorem ipsum.",
    "body": "<p>Dolor <b>sit</b> amet.</p>" // p and b tags allowed
}
```
Replace a blog post if it exists or create a new one
```
PUT /posts
```
