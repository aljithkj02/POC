# 100xDevs cohort  https://github.com/its-id/100x-Cohort-Programs

# Kubectl commands

```
    kubectl get nodes
    kubectl get nodes --v=8     // verboose level 8

    kubectl get pods
    kubectl get pods -owide

    kubectl run nginx --image=nginx --port=80
    kubectl logs nginx
    kubectl describe pod nginx

    kubectl delete pod nginx

    kubectl apply -f <file.yml>

    kubectl get deployment
    kubectl get rs   // rs means replica set

    kubectl describe deployment <deployment_name>

    kubectl get namespaces
    kubectl get pods --all-namespaces
    kubectl create namespace backend

    kubectl config set-context --current --namespace=backend
```