# Kubectl commands

```
    kubectl get nodes
    kubectl get nodes --v=8     // verboose level 8

    kubectl get pods

    kubectl run nginx --image=nginx --port=80
    kubectl logs nginx
    kubectl describe pod nginx

    kubectl delete pod nginx

    kubectl apply -f <file.yml>
```