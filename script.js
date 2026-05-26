// ================= GRAPH =================

let graph = {};

// ================= ADD EDGE =================

function addEdge() {

    const from =
        document.getElementById("fromNode").value;

    const to =
        document.getElementById("toNode").value;

    const weight =
        parseInt(
            document.getElementById("weight").value
        );

    if(!graph[from])
        graph[from] = [];

    if(!graph[to])
        graph[to] = [];

    graph[from].push({
        node: to,
        weight: weight
    });

    graph[to].push({
        node: from,
        weight: weight
    });

    showOutput(`
        <h2>Edge Added</h2>
        <p>${from} ⇄ ${to}
        with weight ${weight}</p>
    `);

    displayGraph();
}

// ================= DISPLAY GRAPH =================

function displayGraph() {

    let html =
        "<h2>Current Graph</h2>";

    for(let node in graph) {

        html += `<p><b>${node}</b> → `;

        graph[node].forEach(edge => {

            html += `
                (${edge.node},
                ${edge.weight})
            `;
        });

        html += "</p>";
    }

    document.getElementById("graphDisplay")
        .innerHTML = html;
}

// ================= APPLY DELAY =================

function applyDelay() {

    const from =
        document.getElementById("delayFrom").value;

    const to =
        document.getElementById("delayTo").value;

    const delay =
        parseInt(
            document.getElementById("delayValue").value
        );

    if(graph[from]) {

        graph[from].forEach(edge => {

            if(edge.node == to) {

                edge.weight += delay;
            }
        });
    }

    if(graph[to]) {

        graph[to].forEach(edge => {

            if(edge.node == from) {

                edge.weight += delay;
            }
        });
    }

    showOutput(`
        <h2>Delay Applied</h2>
        <p>Delay of ${delay}
        added between
        ${from} and ${to}</p>
    `);

    displayGraph();
}

// ================= DIJKSTRA =================

function dijkstra(source, destination) {

    let dist = {};
    let prev = {};
    let visited = {};

    for(let node in graph) {

        dist[node] = Infinity;
        prev[node] = null;
    }

    dist[source] = 0;

    while(true) {

        let current = null;
        let minDist = Infinity;

        for(let node in dist) {

            if(
                !visited[node] &&
                dist[node] < minDist
            ) {

                minDist = dist[node];
                current = node;
            }
        }

        if(current === null)
            break;

        visited[current] = true;

        graph[current].forEach(edge => {

            const neighbor = edge.node;

            const newDist =
                dist[current] + edge.weight;

            if(newDist < dist[neighbor]) {

                dist[neighbor] = newDist;

                prev[neighbor] = current;
            }
        });
    }

    return buildResult(
        source,
        destination,
        dist,
        prev
    );
}

// ================= BELLMAN FORD =================

function bellmanFord(source, destination) {

    let dist = {};
    let prev = {};

    for(let node in graph) {

        dist[node] = Infinity;
        prev[node] = null;
    }

    dist[source] = 0;

    const nodes = Object.keys(graph);

    for(let i=0;i<nodes.length-1;i++) {

        for(let u in graph) {

            graph[u].forEach(edge => {

                const v = edge.node;
                const w = edge.weight;

                if(
                    dist[u] !== Infinity &&
                    dist[u] + w < dist[v]
                ) {

                    dist[v] = dist[u] + w;

                    prev[v] = u;
                }
            });
        }
    }

    return buildResult(
        source,
        destination,
        dist,
        prev
    );
}

// ================= A* =================

function aStar(source, destination) {

    let dist = {};
    let prev = {};
    let visited = {};

    for(let node in graph) {

        dist[node] = Infinity;
        prev[node] = null;
    }

    dist[source] = 0;

    while(true) {

        let current = null;
        let minScore = Infinity;

        for(let node in dist) {

            const heuristic =
                Math.abs(
                    parseInt(destination) -
                    parseInt(node)
                );

            const score =
                dist[node] + heuristic;

            if(
                !visited[node] &&
                score < minScore
            ) {

                minScore = score;
                current = node;
            }
        }

        if(current === null)
            break;

        if(current == destination)
            break;

        visited[current] = true;

        graph[current].forEach(edge => {

            const neighbor = edge.node;

            const newDist =
                dist[current] + edge.weight;

            if(newDist < dist[neighbor]) {

                dist[neighbor] = newDist;

                prev[neighbor] = current;
            }
        });
    }

    return buildResult(
        source,
        destination,
        dist,
        prev
    );
}

// ================= BUILD RESULT =================

function buildResult(
    source,
    destination,
    dist,
    prev
) {

    let path = [];

    let current = destination;

    while(current !== null) {

        path.unshift(current);

        current = prev[current];
    }

    return {
        path: path,
        distance: dist[destination]
    };
}

// ================= TIME MEASUREMENT =================

function measureTime(
    algoFunction,
    source,
    destination
) {

    const ITERATIONS = 500;

    const start =
        performance.now();

    let result;

    for(let i=0;i<ITERATIONS;i++) {

        result =
            algoFunction(
                source,
                destination
            );
    }

    const end =
        performance.now();

    const avgTime =
        (
            (end - start)
            / ITERATIONS
        ).toFixed(4);

    return {
        result: result,
        time: avgTime
    };
}

// ================= RUN DIJKSTRA =================

function runDijkstra() {

    const source =
        document.getElementById("source").value;

    const destination =
        document.getElementById("destination").value;

    const measured =
        measureTime(
            dijkstra,
            source,
            destination
        );

    const result =
        measured.result;

    showOutput(`
        <h2>DIJKSTRA</h2>

        <p>
        <b>Path:</b>
        ${result.path.join(" ➝ ")}
        </p>

        <p>
        <b>Distance:</b>
        ${result.distance}
        </p>

        <p>
        <b>Execution Time:</b>
        ${measured.time} ms
        </p>
    `);
}

// ================= RUN BELLMAN =================

function runBellmanFord() {

    const source =
        document.getElementById("source").value;

    const destination =
        document.getElementById("destination").value;

    const measured =
        measureTime(
            bellmanFord,
            source,
            destination
        );

    const result =
        measured.result;

    showOutput(`
        <h2>BELLMAN-FORD</h2>

        <p>
        <b>Path:</b>
        ${result.path.join(" ➝ ")}
        </p>

        <p>
        <b>Distance:</b>
        ${result.distance}
        </p>

        <p>
        <b>Execution Time:</b>
        ${measured.time} ms
        </p>
    `);
}

// ================= RUN A* =================

function runAStar() {

    const source =
        document.getElementById("source").value;

    const destination =
        document.getElementById("destination").value;

    const measured =
        measureTime(
            aStar,
            source,
            destination
        );

    const result =
        measured.result;

    showOutput(`
        <h2>A* ALGORITHM</h2>

        <p>
        <b>Path:</b>
        ${result.path.join(" ➝ ")}
        </p>

        <p>
        <b>Distance:</b>
        ${result.distance}
        </p>

        <p>
        <b>Execution Time:</b>
        ${measured.time} ms
        </p>
    `);
}

// ================= SHOW OUTPUT =================

function showOutput(html) {

    document.getElementById("output")
        .innerHTML = html;
}
