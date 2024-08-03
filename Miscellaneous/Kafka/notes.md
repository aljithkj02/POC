## To run Kafka locally
```
    docker run -p 9092:9092 -d apache/kafka:3.7.1
```

## Get shell access to container
```
    docker ps
    docker exec -it container_id /bin/bash
    cd /opt/kafka/bin
```

## Create a topic
```
    ./kafka-topics.sh --create --topic quickstart-events --bootstrap-server localhost:9092
```

## Consume from a topic
```
    ./kafka-console-consumer.sh --topic quickstart-events --from-beginning --bootstrap-server localhost:9092
```

## Publish to the topic
```
    ./kafka-console-producer.sh --topic quickstart-events --bootstrap-server localhost:9092
```

## Notes
```
    https://projects.100xdevs.com/tracks/kafka/Kafka-1
```