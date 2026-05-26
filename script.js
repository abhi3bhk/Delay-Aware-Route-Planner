const graph = {};

function addEdge() {

    const u = parseInt(document.getElementById("from").value);
    const v = parseInt(document.getElementById("to").value);
    const w = parseInt(document.getElementById("weight").value);

    if (!graph[u]) graph[u] = [];
    if (!graph[v]) graph[v] = [];

    graph[u].push({ node: v, weight: w });
    graph[v].push({ node: u, weight: w });

    alert(`Edge Added: ${u} ↔ ${v} (${w})`);
}

function applyDelay() {

    const u = parseInt(document.getElementById("delayFrom").value);
    const v = parseInt(document.getElementById("delayTo").value);
    const delay = parseInt(document.getElementById("delayValue").value);

    if (!graph[u] || !graph[v]) {
        alert("Edge does not exist!");
        return;
    }

    graph[u].forEach(edge => {
        if (edge.node === v) {
            edge.weight += delay;
        }
    });

    graph[v].forEach(edge => {
        if (edge.node === u) {
            edge.weight += delay;
        }
    });

    alert(`Delay Applied on ${u} ↔ ${v}`);
}

function reconstructPath(parent, dest) {

    const path = [];

    while (dest !== null) {
        path.push(dest);
        dest = parent[dest];
    }

    return path.reverse().join(" → ");
}

function measureTime(func) {

    const start = performance.now();

    const result = func();

    const end = performance.now();

    return {
        result,
        time: (end - start).toFixed(4)
    };
}

// ---------------- DIJKSTRA ----------------

function dijkstra(src, dest) {

    const dist = {};
    const visited = {};
    const parent = {};

    for (let node in graph) {
        dist[node] = Infinity;
        visited[node] = false;
        parent[node] = null;
    }

    dist[src] = 0;

    while (true) {

        let current = null;
        let minDist = Infinity;

        for (let node in dist) {

            if (!visited[node] && dist[node] < minDist) {
                minDist = dist[node];
                current = node;
            }
        }

        if (current === null) break;

        visited[current] = true;

        graph[current].forEach(edge => {

            let newDist = dist[current] + edge.weight;

            if (newDist < dist[edge.node]) {

                dist[edge.node] = newDist;
                parent[edge.node] = current;
            }
        });
    }

    return {
        path: reconstructPath(parent, dest),
        distance: dist[dest]
    };
}

// ---------------- BELLMAN FORD ----------------

function bellmanFord(src, dest) {

    const dist = {};
    const parent = {};

    for (let node in graph) {
        dist[node] = Infinity;
        parent[node] = null;
    }

    dist[src] = 0;

    const edges = [];

    for (let u in graph) {

        graph[u].forEach(edge => {
            edges.push([u, edge.node, edge.weight]);
        });
    }

    for (let i = 0; i < Object.keys(graph).length - 1; i++) {

        edges.forEach(edge => {

            const [u, v, w] = edge;

            if (dist[u] !== Infinity &&
                dist[u] + w < dist[v]) {

                dist[v] = dist[u] + w;
                parent[v] = u;
            }
        });
    }

    return {
        path: reconstructPath(parent, dest),
        distance: dist[dest]
    };
}

// ---------------- A* ----------------

function heuristic(a, b) {
    return Math.abs(a - b);
}

function aStar(src, dest) {

    const openSet = [src];

    const gScore = {};
    const fScore = {};
    const parent = {};

    for (let node in graph) {
        gScore[node] = Infinity;
        fScore[node] = Infinity;
        parent[node] = null;
    }

    gScore[src] = 0;
    fScore[src] = heuristic(src, dest);

    while (openSet.length > 0) {

        let current = openSet[0];

        for (let node of openSet) {

            if (fScore[node] < fScore[current]) {
                current = node;
            }
        }

        if (current == dest) {

            return {
                path: reconstructPath(parent, dest),
                distance: gScore[dest]
            };
        }

        openSet.splice(openSet.indexOf(current), 1);

        graph[current].forEach(edge => {

            const tentative =
                gScore[current] + edge.weight;

            if (tentative < gScore[edge.node]) {

                parent[edge.node] = current;

                gScore[edge.node] = tentative;

                fScore[edge.node] =
                    tentative +
                    heuristic(edge.node, dest);

                if (!openSet.includes(edge.node.toString())) {
                    openSet.push(edge.node.toString());
                }
            }
        });
    }

    return {
        path: "No Path",
        distance: Infinity
    };
}

// ---------------- RUN FUNCTIONS ----------------

function displayResult(name, data) {

    document.getElementById("output").innerText =
        `${name}

Path: ${data.result.path}

Distance: ${data.result.distance}

Execution Time: ${data.time} ms`;
}

function runDijkstra() {

    const src =
        document.getElementById("source").value;

    const dest =
        document.getElementById("destination").value;

    const data =
        measureTime(() => dijkstra(src, dest));

    displayResult("DIJKSTRA", data);
}

function runBellmanFord() {

    const src =
        document.getElementById("source").value;

    const dest =
        document.getElementById("destination").value;

    const data =
        measureTime(() => bellmanFord(src, dest));

    displayResult("BELLMAN-FORD", data);
}

function runAStar() {

    const src =
        document.getElementById("source").value;

    const dest =
        document.getElementById("destination").value;

    const data =
        measureTime(() => aStar(src, dest));

    displayResult("A* ALGORITHM", data);
}
