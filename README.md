# Monolithic vs. Microservices Comparison

This project provides a practical comparison between monolithic and microservices architectures. It includes two implementations of a simple application: one as a single monolithic application and the other as a set of containerized microservices.

## Project Structure

- `monolithic/`: Contains the monolithic version of the application, built with Node.js and Express.
- `microservices/`: Contains the microservices version of the application, with services containerized using Docker.

## Prerequisites

- Node.js
- Docker
- Docker Compose

## Getting Started

### Monolithic Application

1. **Navigate to the monolithic directory:**
   ```bash
   cd monolithic
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the application:**
   ```bash
   npm start
   ```

The application will be running at `http://localhost:3000`.

### Microservices Application

1. **Navigate to the microservices directory:**
   ```bash
   cd microservices
   ```

2. **Build and run the services using Docker Compose:**
   ```bash
   docker-compose up --build
   ```

The services will be orchestrated by Docker Compose, and the application will be accessible through an API gateway.

## Purpose

This project aims to highlight the differences in development, deployment, and scalability between monolithic and microservices architectures. By providing two distinct implementations of the same application, developers can explore and understand the trade-offs of each approach.
