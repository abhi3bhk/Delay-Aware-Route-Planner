#include <iostream>
#include <vector>
#include <queue>
#include <limits>
#include <chrono>
using namespace std;
using namespace std::chrono;

const int INF = 1e9;

class Graph {
public:
    int V;
    vector<vector<pair<int, int>>> adj;

    Graph(int V) {
        this->V = V;
        adj.resize(V);
    }

    void addEdge(int u, int v, int w) {
        adj[u].push_back({v, w});
        adj[v].push_back({u, w});
    }

    void addDelay(int u, int v, int delay) {
        for (auto &edge : adj[u]) {
            if (edge.first == v) {
                edge.second += delay;
            }
        }
        for (auto &edge : adj[v]) {
            if (edge.first == u) {
                edge.second += delay;
            }
        }
    }

    vector<int> dijkstra(int src, vector<int> &parent) {
        vector<int> dist(V, INF);
        priority_queue<pair<int,int>, vector<pair<int,int>>, greater<pair<int,int>>> pq;

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

    vector<int> bellmanFord(int src, vector<int> &parent) {
        vector<int> dist(V, INF);
        dist[src] = 0;
        parent[src] = -1;

        for (int i = 0; i < V - 1; i++) {
            for (int u = 0; u < V; u++) {
                for (auto edge : adj[u]) {
                    int v = edge.first;
                    int weight = edge.second;

                    if (dist[u] != INF && dist[u] + weight < dist[v]) {
                        dist[v] = dist[u] + weight;
                        parent[v] = u;
                    }
                }
            }
        }
        return dist;
    }

    void printPath(int dest, vector<int> &parent) {
        if (dest == -1) return;
        printPath(parent[dest], parent);
        cout << dest << " ";
    }
};

int main() {
    int V = 6;
    Graph g(V);

    // Graph edges
    g.addEdge(0, 1, 4);
    g.addEdge(0, 2, 2);
    g.addEdge(1, 2, 1);
    g.addEdge(1, 3, 5);
    g.addEdge(2, 4, 10);
    g.addEdge(3, 5, 3);
    g.addEdge(4, 5, 4);

    int src = 0, dest = 5;

    // -------- BEFORE DELAY --------
    vector<int> parentD(V), parentB(V);

    auto start1 = high_resolution_clock::now();
    vector<int> distD = g.dijkstra(src, parentD);
    auto end1 = high_resolution_clock::now();

    auto start2 = high_resolution_clock::now();
    vector<int> distB = g.bellmanFord(src, parentB);
    auto end2 = high_resolution_clock::now();

    cout << "Before Delay:\n";

    cout << "\nDijkstra Path: ";
    g.printPath(dest, parentD);
    cout << "\nDistance: " << distD[dest];
    cout << "\nTime: " << duration_cast<microseconds>(end1 - start1).count() << " microseconds\n";

    cout << "\nBellman-Ford Path: ";
    g.printPath(dest, parentB);
    cout << "\nDistance: " << distB[dest];
    cout << "\nTime: " << duration_cast<microseconds>(end2 - start2).count() << " microseconds\n";

    // -------- USER INPUT FOR DELAY --------
    int u, v, delay;
    cout << "\nEnter edge (u v) to add delay: ";
    cin >> u >> v;
    cout << "Enter delay value: ";
    cin >> delay;

    g.addDelay(u, v, delay);

    // -------- AFTER DELAY --------
    vector<int> parentD2(V), parentB2(V);

    auto start3 = high_resolution_clock::now();
    vector<int> distD2 = g.dijkstra(src, parentD2);
    auto end3 = high_resolution_clock::now();

    auto start4 = high_resolution_clock::now();
    vector<int> distB2 = g.bellmanFord(src, parentB2);
    auto end4 = high_resolution_clock::now();

    cout << "\nAfter Delay:\n";

    cout << "\nDijkstra Path: ";
    g.printPath(dest, parentD2);
    cout << "\nDistance: " << distD2[dest];
    cout << "\nTime: " << duration_cast<microseconds>(end3 - start3).count() << " microseconds\n";

    cout << "\nBellman-Ford Path: ";
    g.printPath(dest, parentB2);
    cout << "\nDistance: " << distB2[dest];
    cout << "\nTime: " << duration_cast<microseconds>(end4 - start4).count() << " microseconds\n";

    return 0;
}