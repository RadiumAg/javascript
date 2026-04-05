FROM docker.elastic.co/elasticsearch/elasticsearch:8.13.4

ENV discovery.type=single-node \
    xpack.security.enabled=false \
    ES_JAVA_OPTS="-Xms512m -Xmx512m"

EXPOSE 9200 9300
