import express from 'express'
import cluster from 'cluster'
import os from 'os'

const totalCpus = os.cpus().length;
const port = 8000;

if (cluster.isPrimary) {
    console.log("Total number of CPUs available is", totalCpus);
    console.log(`Primary ${process.pid} is running`);

    // For workers 
    for (let i=0; i<totalCpus; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
        console.log("Let's fork another worker!");
        cluster.fork();
    });
} else {
    const app = express();
    console.log(`Worker ${process.pid} Started!`);

    app.get('/', (req, res) => {
        res.send(`Process Id is ${process.pid}`);
    })

    app.listen(port, () => console.log("Server started on port", port));
}
