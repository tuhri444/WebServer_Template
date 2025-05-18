const express = require('express');
const { createServer: createViteServer } = require('vite');
const serve = require('serve');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || 'development';

async function startServer() {
    if (ENV === 'release') {
        // Serve the built files using 'serve'
        const buildPath = path.resolve(__dirname, 'dist');
        serve(buildPath, { port: PORT });
        console.log(`Serving built files from ${buildPath} on port ${PORT}`);
    } else {
        // Use Vite in development mode
        const vite = await createViteServer({
            server: { middlewareMode: 'html' },
        });

        app.use(vite.middlewares);

        app.get('/', async (req, res) => {
            const indexPath = path.resolve(__dirname, 'index.html');
            fs.readFile(indexPath, 'utf-8', async (err, html) => {
            if (err) {
                console.error('Error reading index.html:', err);
                res.status(500).end('Internal Server Error');
                return;
            }
            const transformedHtml = await vite.transformIndexHtml(req.url, html);
            res.status(200).set({ 'Content-Type': 'text/html' }).end(transformedHtml);
            });
        });

        app.listen(PORT, () => {
            console.log(`Vite dev server running at http://localhost:${PORT}`);
        });
    }
}

startServer().catch((err) => {
    console.error('Error starting server:', err);
    process.exit(1);
});