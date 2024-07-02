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
```