# Project Structure Overview

This repository implements a Bulk Milk Tank Digital Twin web app, consisting of several main components. Below is a general explanation of each major part:

---

## Backend

The `backend` folder contains the Express.js server that exposes the REST API for the platform and real time communication with SocketIO. It handles business logic, communicates with both InfluxDB (for time-series sensor data) and MongoDB (for persistent storage and configuration), and integrates with the ML-API for classification analysis.

---

## Frontend

The `frontend` folder contains a React.js application that provides the user interface for the digital twin. It allows users to visualize real-time and historical tank data, interact with sensor readings, view classification, and manage filters and settings. The frontend communicates with the backend API to fetch and display all relevant information and throught SocketIO for real time communication.

---

## ML-API

The `ml-api` contains a microservice dedicated to machine learning tasks. This service receives processed sensor data from the backend, runs classification model, and returns results to the backend for further processing or display.

---

## Mongo Folder

The `mongo-data` (or similar) directory is used for MongoDB data persistence and initialization. It stores the database files and may include initialization scripts or seed data that are automatically loaded when the MongoDB container starts.

---

## Docker Compose Files

- **docker-compose.dev.yml**  
  This file defines the multi-container setup for local development. It orchestrates the backend, frontend, ML-API, InfluxDB, and MongoDB services, sets up necessary environment variables, mounts source code for live reload, and exposes the required ports for development.

- **docker-compose.prod.yml**  
  This file is intended for production deployments. It typically uses optimized images, disables development features like hot-reload, and may include additional security or scaling configurations. (This is for future work)

---

## Summary

Together, these components provide a scalable, modular platform for monitoring, analyzing, and classify the state of bulk milk tanks using real-time sensor data, historical records, and machine learning all accessible through a modern web interface.