# My CI/CD App

A small containerized app deployed through a full CI/CD pipeline onto a self-hosted, highly-available Kubernetes cluster running in nested VMware ESXi VMs.

## Architecture

- **Virtualization**: VMware Workstation running ESXi 8 as a nested hypervisor
- **Kubernetes cluster**: 3 nodes (kubeadm-based)
  - `master` — control-plane
  - `worker1`, `worker2` — worker nodes
- **CNI**: Flannel (pod networking)
- **Load Balancing**: HAProxy round-robins traffic across all 3 nodes' NodePort
- **High Availability**: Keepalived provides a floating virtual IP (VIP) between `master` and `worker1`, so the load balancer itself has automatic failover
- **CI/CD**: GitHub Actions builds the Docker image on every push to `main` and pushes it to Docker Hub

## Pipeline flow

1. Code pushed to `main` branch on GitHub
2. GitHub Actions checks out the code
3. Builds a Docker image (no-cache, to always reflect latest changes)
4. Pushes the image to Docker Hub as `hanif040/myapp:latest`
5. Kubernetes deployment is updated to pull and run the new image (`kubectl rollout restart`)
6. App is served via NodePort, load-balanced through HAProxy, reachable via the Keepalived VIP

## Stack

- **App**: Static HTML served via nginx (Alpine-based image)
- **Container runtime**: containerd
- **Orchestration**: Kubernetes (kubeadm)
- **CI/CD**: GitHub Actions
- **Registry**: Docker Hub

## Local development

\`\`\`bash
docker build -t myapp:local .
docker run -d -p 8080:80 myapp:local
curl http://localhost:8080
\`\`\`

## Deployment

\`\`\`bash
kubectl create deployment myapp --image=hanif040/myapp:latest
kubectl expose deployment myapp --port=80 --type=NodePort
kubectl rollout restart deployment myapp
\`\`\`
