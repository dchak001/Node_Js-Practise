const http = require('http');
const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;
    if (url === "/") {
        res.setHeader('Content-Type','text/html');
        res.write(`<html lang="en">
        <head>
            <title>New Page</title>
        </head>`);
        res.write(`<body>
                        <form action="/create-user" method="post">
                            Username: <input type="text" name="username" >
                            <button type="submit">Send</button>
                        </form>
                    </body>`);
        res.write(`</html>`);
        return res.end();
    }
    if (url === "/create-user" && method === "POST") {
        const body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        });
        req.on("end", () => {
            const parsedBody = Buffer.concat(body).toString();
            console.log(parsedBody.split("=")[1]);
        })

        res.statusCode = 302;
        res.setHeader('Location', '/');
        return res.end();
    }
    if (url === "/users") {
        res.setHeader('Content-Type','text/html')
        res.write(`<html lang="en">
        <head>
            <title>New Page</title>
        </head>`);
        res.write(`<body>
        <ul>
       <li>User 1</li>
       <li>User 2</li>
   </ul>
    </body>`);
        res.write(`</html>`);
        return res.end();
    }
});
server.listen(3000);