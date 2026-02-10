# High-Scale Energy Ingestion Engine – Architecture Documentation

## 📌 Objective

This system is designed to ingest, correlate, and analyze **high-frequency telemetry data** coming from a large fleet of **Smart Meters and Electric Vehicles (EVs)**.

The platform handles:
- ~**10,000 devices**
- **2 telemetry streams per device**
- **1 update per minute**
- ≈ **14.4 million records per day**

The primary goal is to ensure **high write throughput**, **fast analytical queries**, and **efficient data correlation**, without degrading performance as data volume grows.

---

## 🔁 Telemetry Streams & Data Correlation

### Independent Data Sources

The system ingests **two independent telemetry streams**:

1. **Grid-side (Smart Meter)**
   - Reports **AC energy consumed**
   - Example metric: `kwhConsumedAc`

2. **Vehicle-side (EV / Charger)**
   - Reports **DC energy delivered**
   - Example metrics: `kwhDeliveredDc`, `SoC`, `batteryTemp`

These streams:
- Arrive **independently**
- Are **not guaranteed** to be synchronized
- Can arrive in **any order**

---

### Correlation Strategy

Instead of correlating data at write-time (which would block ingestion), the system uses:

### ✅ **Time-window–based correlation**

- Data is correlated **during analytics queries**
- Records are grouped by:
  - `vehicleId`
  - **bounded time window** (e.g., last 24 hours)

This approach ensures:
- Ingestion remains fast and non-blocking
- Late or missing telemetry does not break the system
- Analytics remain accurate within defined time windows

---

## 🗄️ Data Storage Architecture

To handle scale efficiently, the system separates data into **Cold** and **Hot** stores.

---

## ❄️ Cold Store (Historical Telemetry)

Used for **analytics and auditing**.

### Characteristics
- **Append-only**
- **INSERT-only**
- Never updated or deleted

### Tables
- `meter_telemetry_history`
- `vehicle_telemetry_history`

### Why this works at scale
- INSERT operations are the fastest database writes
- No locks caused by updates
- Indexed by `(deviceId, timestamp)` for efficient range queries
- Easily supports tens of millions of rows per day

---

## 🔥 Hot Store (Live Operational State)

Used for **real-time dashboards and latest status**.

### Characteristics
- **One row per vehicle**
- Updated continuously using **UPSERT**
- Always reflects the **latest known state**

### Table
- `vehicle_live_status`

### Why this exists
Without a hot store:
- Dashboards would need to scan millions of rows
- Queries would slow down as data grows

With a hot store:
- Current data is fetched in **O(1) time**
- Historical growth does not impact live performance

---

## 🧠 Insert vs Upsert Strategy

| Data Type | Strategy | Reason |
|---------|--------|------|
| Historical telemetry | INSERT | Immutable, high-throughput writes |
| Live vehicle state | UPSERT | Always keep latest snapshot |

This separation avoids:
- Full-table scans
- Expensive update locks on large tables

---

## 📊 Analytics at Scale (14.4M Records / Day)

### Key Techniques Used

#### 1️⃣ Bounded Time Windows
Analytics queries are always limited to a **fixed time range** (e.g., last 24 hours).

This prevents:
- Unbounded scans
- Performance degradation over time

---

#### 2️⃣ Indexed Aggregations
Indexes exist on:
- `vehicleId`
- `timestamp`

This enables:
- Fast SUM / AVG operations
- Efficient grouping without scanning entire tables

---

#### 3️⃣ Read-Optimized Query Design
Analytics queries:
- Aggregate AC and DC energy separately
- Compute efficiency at query time: 
Efficiency = Total DC Delivered / Total AC Consumed

  
This avoids:
- Storing redundant derived data
- Data inconsistency issues

---

## 🚀 How the System Handles 14.4 Million Records Daily

| Challenge | Solution |
|-------|--------|
| High write volume | Append-only inserts |
| Lock contention | No updates on history tables |
| Growing data size | Time-bounded queries |
| Dashboard latency | Hot store with upserts |
| Correlation complexity | Query-time correlation |

The system scales **linearly** with data volume and remains performant as records accumulate.

---

## 🧩 Why This Architecture Was Chosen

- Write-heavy systems fail when reads and writes compete
- Real-time dashboards should not depend on historical scans
- Correlation should not block ingestion
- Historical data must remain immutable and auditable

This architecture reflects **real-world, production-grade telemetry platforms** used in IoT and energy systems.

---

## 👤 Author

**Rahul Kumar Mandal**  
Backend Developer – Node.js / NestJS

