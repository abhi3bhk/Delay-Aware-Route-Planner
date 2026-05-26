#include <iostream>
#include <vector>
#include <queue>
#include <limits>
#include <chrono>
#include <cmath>

using namespace std;
using namespace std::chrono;

const int INF = 1e9;

// ---------------- GRAPH CLASS ----------------

class Graph {

    int V;

    vector<vector<pair<int, int>>> adj;

public:

    Graph(int V) {

        this->V = V;
        adj.resize(V);
    }

    // ---------------- ADD EDGE ----------------

    void addEdge(int u, int v, int w) {

        adj[u].push_back({v, w});
        adj[v].push_back({u, w});
    }

    // ---------------- ADD DELAY ----------------

    void addDelay(int u, int v, int delay) {

        bool found = false;

        for (auto &edge : adj[u]) {

            if (edge.first == v) {

                edge.second += delay;
                found = true;
            }
        }

        for (auto &edge : adj[v]) {

            if (edge.first == u) {

                edge.second += delay;
            }
        }

        if (found) {

            cout << "\nDelay applied successfully.\n";
        }
        else {

            cout << "\nEdge not found.\n";
        }
    }

    // ---------------- PRINT PATH ----------------

    void printPath(int dest, vector<int> &parent) {

        if (dest == -1)
            return;

        printPath(parent[dest], parent);

        cout << dest << " ";
    }

    // ---------------- DIJKSTRA ----------------

    vector<int> dijkstra(int src, vector<int> &parent) {

        vector<int> dist(V, INF);

        priority_queue<
            pair<int, int>,
            vector<pair<int, int>>,
            greater<pair<int, int>>
        > pq;

        dist[src] = 0;
        parent[src] = -1;

        pq.push({0, src});

        while (!pq.empty()) {

            int u = pq.top().second;
            pq.pop();

            for (auto edge : adj[u]) {

                int v = edge.first;
                int weight = edge.second;

                if (dist[u] + weight < dist[v]) {

                    dist[v] = dist[u] + weight;

                    parent[v] = u;

                    pq.push({dist[v], v});
                }
            }
        }

        return dist;
    }

    // ---------------- BELLMAN FORD ----------------

    vector<int> bellmanFord(int src, vector<int> &parent) {

        vector<int> dist(V, INF);

        dist[src] = 0;
        parent[src] = -1;

        for (int i = 0; i < V - 1; i++) {

            for (int u = 0; u < V; u++) {

                for (auto edge : adj[u]) {

                    int v = edge.first;
                    int weight = edge.second;

                    if (dist[u] != INF &&
                        dist[u] + weight < dist[v]) {

                        dist[v] = dist[u] + weight;

                        parent[v] = u;
                    }
                }
            }
        }

        return dist;
    }

    // ---------------- HEURISTIC ----------------

    int heuristic(int node, int dest) {

        return abs(dest - node);
    }

    // ---------------- A* ALGORITHM ----------------

    vector<int> aStar(int src, int dest, vector<int> &parent) {

        vector<int> gScore(V, INF);
        vector<int> fScore(V, INF);

        priority_queue<
            pair<int, int>,
            vector<pair<int, int>>,
            greater<pair<int, int>>
        > pq;

        gScore[src] = 0;

        fScore[src] = heuristic(src, dest);

        parent[src] = -1;

        pq.push({fScore[src], src});

        while (!pq.empty()) {

            int u = pq.top().second;
            pq.pop();

            if (u == dest)
                break;

            for (auto edge : adj[u]) {

                int v = edge.first;
                int weight = edge.second;

                int tentative =
                    gScore[u] + weight;

                if (tentative < gScore[v]) {

                    gScore[v] = tentative;

                    fScore[v] =
                        tentative +
                        heuristic(v, dest);

                    parent[v] = u;

                    pq.push({fScore[v], v});
                }
            }
        }

        return gScore;
    }
};

// ---------------- MAIN ----------------

int main() {

    int V = 6;

    Graph g(V);

    // Sample Graph
    g.addEdge(0, 1, 4);
    g.addEdge(0, 2, 2);
    g.addEdge(1, 2, 1);
    g.addEdge(1, 3, 5);
    g.addEdge(2, 4, 10);
    g.addEdge(3, 5, 3);
    g.addEdge(4, 5, 4);

    int src = 0;
    int dest = 5;

    vector<int> parentD(V);
    vector<int> parentB(V);
    vector<int> parentA(V);

    // ---------------- DIJKSTRA ----------------

    auto startD =
        high_resolution_clock::now();

    vector<int> distD =
        g.dijkstra(src, parentD);

    auto endD =
        high_resolution_clock::now();

    // ---------------- BELLMAN FORD ----------------

    auto startB =
        high_resolution_clock::now();

    vector<int> distB =
        g.bellmanFord(src, parentB);

    auto endB =
        high_resolution_clock::now();

    // ---------------- A* ----------------

    auto startA =
        high_resolution_clock::now();

    vector<int> distA =
        g.aStar(src, dest, parentA);

    auto endA =
        high_resolution_clock::now();

    // ---------------- OUTPUT ----------------

    cout << "========== BEFORE DELAY ==========\n";

    // Dijkstra
    cout << "\nDIJKSTRA\n";

    cout << "Path: ";
    g.printPath(dest, parentD);

    cout << "\nDistance: "
         << distD[dest];

    cout << "\nExecution Time: "
         << duration_cast<nanoseconds>(
                endD - startD
            ).count()
         << " ns\n";

    // Bellman Ford
    cout << "\nBELLMAN-FORD\n";

    cout << "Path: ";
    g.printPath(dest, parentB);

    cout << "\nDistance: "
         << distB[dest];

    cout << "\nExecution Time: "
         << duration_cast<nanoseconds>(
                endB - startB
            ).count()
         << " ns\n";

    // A*
    cout << "\nA* ALGORITHM\n";

    cout << "Path: ";
    g.printPath(dest, parentA);

    cout << "\nDistance: "
         << distA[dest];

    cout << "\nExecution Time: "
         << duration_cast<nanoseconds>(
                endA - startA
            ).count()
         << " ns\n";

    // ---------------- DELAY INPUT ----------------

    int u, v, delay;

    cout << "\nEnter edge (u v): ";
    cin >> u >> v;

    cout << "Enter delay: ";
    cin >> delay;

    g.addDelay(u, v, delay);

    // ---------------- RECOMPUTE ----------------

    vector<int> distD2 =
        g.dijkstra(src, parentD);

    vector<int> distB2 =
        g.bellmanFord(src, parentB);

    vector<int> distA2 =
        g.aStar(src, dest, parentA);

    // ---------------- AFTER DELAY ----------------

    cout << "\n========== AFTER DELAY ==========\n";

    cout << "\nDijkstra Distance: "
         << distD2[dest];

    cout << "\nBellman-Ford Distance: "
         << distB2[dest];

    cout << "\nA* Distance: "
         << distA2[dest]
         << endl;

    return 0;
}
