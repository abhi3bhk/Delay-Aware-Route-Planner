const graph = {};
const nodeCount = 100;

function addEdge() {

    const u = parseInt(document.getElementById("from").value);
    const v = parseInt(document.getElementById("to").value);
    const w = parseInt(document.getElementById("weight").value);

    if (!graph[u]) graph[u] = [];
    if (!graph[v]) graph[v] = [];

    graph[u].push({ node: v, weight: w });
    graph[v].push({ node: u, weight: w });

    alert(`Edge added: ${u} ↔ ${v} (${w})`);
}

function applyDelay() {

    const u = parseInt(document.getElementById("delayFrom").value);
    const v = parseInt(document.getElementById("delayTo").value);
    const delay = parseInt(document.getElementById("delayValue").value);

    if (!graph[u]) return;

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

    alert(`Delay added on edge ${u} ↔ ${v}`);
}

function reconstructPath(parent, dest) {

    const path = [];

    while (dest !== null) {
        path.push(dest);
        dest = parent[dest];
    }

    return path.reverse().join(" → ");
}

function dijkstra(src, dest) {

    const dist = {};
    const parent = {};
    const visited = {};

    for (let node in graph) {
        dist[node] = Infinity;
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

            const newDist = dist[current] + edge.weight;

            if (newDist < dist[edge.node]) {
                dist[edge.node] = newDist;
                parent[edge.node] = current;
            }
        });
    }

    return {
        distance: dist[dest],
        path: reconstructPath(parent, dest)
    };
}

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

            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                parent[v] = u;
            }
        });
    }

    return {
        distance: dist[dest],
        path: reconstructPath(parent, dest)
    };
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

function runDijkstra() {

    const src = document.getElementById("source").value;
    const dest = document.getElementById("destination").value;

    const data = measureTime(() => dijkstra(src, dest));

    document.getElementById("output").innerText =
        `DIJKSTRA\n\nPath: ${data.result.path}\nDistance: ${data.result.distance}\nExecution Time: ${data.time} ms`;
}

function runBellmanFord() {

    const src = document.getElementById("source").value;
    const dest = document.getElementById("destination").value;

    const data = measureTime(() => bellmanFord(src, dest));

    document.getElementById("output").innerText =
        `BELLMAN-FORD\n\nPath: ${data.result.path}\nDistance: ${data.result.distance}\nExecution Time: ${data.time} ms`;
}
