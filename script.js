let graph = {};

// ================= SHOW OUTPUT =================

function showOutput(html) {

    document.getElementById("output")
        .innerHTML = html;
}

// ================= DISPLAY GRAPH =================

function displayGraph() {

    let html = "";

    if(Object.keys(graph).length === 0) {

        html = "No graph created yet...";
    }

    else {

        for(let node in graph) {

            html += `
                <p>
                <b>${node}</b> →
            `;

            graph[node].forEach(edge => {

                html += `
                    (${edge.node},
                    ${edge.weight})
                `;
            });

            html += "</p>";
        }
    }

    document.getElementById("graphDisplay")
        .innerHTML = html;
}

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

    // Validation

    if(
        from === "" ||
        to === "" ||
        isNaN(weight)
    ) {

        alert("Please fill all fields.");

        return;
    }

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

    displayGraph();

    showOutput(`
        <h2>Edge Added Successfully</h2>

        <p>
        Added edge between
        <b>${from}</b>
        and
        <b>${to}</b>

        with weight
        <b>${weight}</b>
        </p>
    `);

    // Clear inputs

    document.getElementById("fromNode").value = "";
    document.getElementById("toNode").value = "";
    document.getElementById("weight").value = "";
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

    if(
        from === "" ||
        to === "" ||
        isNaN(delay)
    ) {

        alert("Please fill all fields.");

        return;
    }

    let found = false;

    if(graph[from]) {

        graph[from].forEach(edge => {

            if(edge.node == to) {

                edge.weight += delay;

                found = true;
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

    if(found) {

        displayGraph();

        showOutput(`
            <h2>Delay Applied</h2>

            <p>
            Delay of
            <b>${delay}</b>

            added between

            <b>${from}</b>
            and
            <b>${to}</b>
            </p>
        `);
    }

    else {

        showOutput(`
            <h2>Edge Not Found</h2>

            <p>
            Please enter a valid edge.
            </p>
        `);
    }
}

// ================= BUILD RESULT =================

function buildResult(destination, dist, prev) {

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

        let bestScore = Infinity;

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
                score < bestScore
            ) {

                bestScore = score;

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
        destination,
        dist,
        prev
    );
}

// ================= MEASURE TIME =================

function measureTime(
    algo,
    source,
    destination
) {

    const ITERATIONS = 500;

    const start =
        performance.now();

    let result;

    for(let i=0;i<ITERATIONS;i++) {

        result =
            algo(source, destination);
    }

    const end =
        performance.now();

    return {

        result: result,

        time: (
            (end - start)
            / ITERATIONS
        ).toFixed(4)
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
