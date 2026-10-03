FROM eclipse-temurin:21-jre

WORKDIR /app

COPY sentinel-dashboard-1.8.9.jar app.jar

ENV JAVA_OPTS="-Xms256m -Xmx512m"

EXPOSE 8858

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dserver.port=8858 -Dcsp.sentinel.dashboard.server=localhost:8858 -Dproject.name=sentinel-dashboard -jar app.jar"]
