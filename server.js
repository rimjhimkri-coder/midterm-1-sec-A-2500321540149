
const http = require("http");
const fs = require("fs");

const PORT = 5000;

function getBooks() {
    return JSON.parse(fs.readFileSync("books.json"));
}

const server = http.createServer((req, res) => {

    res.setHeader("Content-Type", "application/json");

    if (req.method === "GET" && req.url === "/books") {
        res.end(JSON.stringify(getBooks()));
    }

    
    else if (req.method === "POST" && req.url === "/books") {
        let body = "";

        req.on("data", data => body += data);

        req.on("end", () => {
            try {
                let books = getBooks();
                let book = JSON.parse(body);

                books.push(book);

                fs.writeFileSync("books.json", JSON.stringify(books, null, 2));

                res.end(JSON.stringify({ message: "Book Added" }));
            } catch (err) {
                res.writeHead(400);
                res.end(JSON.stringify({ message: "Invalid JSON body", error: err.message }));
            }
        });
    }

    
    else if (req.method === "PUT" && req.url.startsWith("/books/")) {
        let id = Number(req.url.split("/")[2]);
        let body = "";

        req.on("data", data => body += data);

        req.on("end", () => {
            let books = getBooks();
            let data = JSON.parse(body);

            let index = books.findIndex(b => b.id === id);

            if (index !== -1) {
                books[index] = data;
                fs.writeFileSync("books.json", JSON.stringify(books, null, 2));
                res.end(JSON.stringify({ message: "Book Updated" }));
            } else {
                res.end(JSON.stringify({ message: "Book Not Found" }));
            }
        });
    }

    
    else if (req.method === "DELETE" && req.url.startsWith("/books/")) {
        let id = Number(req.url.split("/")[2]);

        let books = getBooks();
        books = books.filter(b => b.id !== id);

        fs.writeFileSync("books.json", JSON.stringify(books, null, 2));

        res.end(JSON.stringify({ message: "Book Deleted" }));
    }


    else if (req.method === "GET" && req.url === "/") {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(fs.readFileSync("public/index.html"));
    }

    else if (req.method === "GET" && req.url === "/style.css") {
        res.writeHead(200, { "Content-Type": "text/css" });
        res.end(fs.readFileSync("public/style.css"));
    }

    else if (req.method === "GET" && req.url === "/script.js") {
        res.writeHead(200, { "Content-Type": "text/javascript" });
        res.end(fs.readFileSync("public/script.js"));
    }

    else {
        res.end(JSON.stringify({ message: "Invalid Request" }));
    }
});

server.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});




