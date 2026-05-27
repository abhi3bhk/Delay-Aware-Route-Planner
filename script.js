let graph = {};
        measureTime(dijkstra, source, destination);

    const result = measured.result;

    showOutput(`
        <h2>DIJKSTRA</h2>

        <p><b>Path:</b>
        ${result.path.join(" ➝ ")}</p>

        <p><b>Distance:</b>
        ${result.distance}</p>

        <p><b>Execution Time:</b>
        ${measured.time} ms</p>
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

    const result = measured.result;

    showOutput(`
        <h2>BELLMAN-FORD</h2>

        <p><b>Path:</b>
        ${result.path.join(" ➝ ")}</p>

        <p><b>Distance:</b>
        ${result.distance}</p>

        <p><b>Execution Time:</b>
        ${measured.time} ms</p>
    `);
}

// ================= RUN A* =================

function runAStar() {

    const source =
        document.getElementById("source").value;

    const destination =
        document.getElementById("destination").value;

    const measured =
        measureTime(aStar, source, destination);

    const result = measured.result;

    showOutput(`
        <h2>A* ALGORITHM</h2>

        <p><b>Path:</b>
        ${result.path.join(" ➝ ")}</p>

        <p><b>Distance:</b>
        ${result.distance}</p>

        <p><b>Execution Time:</b>
        ${measured.time} ms</p>
    `);
}

// ================= SHOW OUTPUT =================

function showOutput(html) {

    document.getElementById("output")
        .innerHTML = html;
}
