# Stage 1: build con Maven + JDK 21
FROM maven:3.9.5-eclipse-temurin-21 AS build
WORKDIR /app

# Opcional: aumentar memoria para Maven si fuera necesario
ARG MAVEN_OPTS="-Xmx1024m"
ENV MAVEN_OPTS=${MAVEN_OPTS}

# Copiar pom primero para cache de dependencias
COPY pom.xml ./
# Si usas wrapper y settings, cópialos también
COPY .mvn .mvn
COPY mvnw .mvnw

# Descargar dependencias (capa cacheable)
RUN mvn -B dependency:go-offline

# Copiar fuente y empaquetar
COPY src ./src
RUN mvn -B package -DskipTests

# Stage 2: runtime con JRE 21
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

# Carpeta para uploads y volumen persistente
RUN mkdir -p /uploads && chown -R 1000:1000 /uploads
VOLUME ["/uploads"]

EXPOSE 8080
USER 1000

ENTRYPOINT ["java","-jar","/app/app.jar"]
