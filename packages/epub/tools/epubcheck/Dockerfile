FROM eclipse-temurin:21-jre-jammy

ARG EPUBCHECK_VERSION=5.4.0

WORKDIR /opt/epubcheck

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        unzip \
    && rm -rf /var/lib/apt/lists/*

RUN set -eux; \
    curl --fail --show-error --location --retry 3 \
        "https://github.com/w3c/epubcheck/releases/download/v${EPUBCHECK_VERSION}/epubcheck-${EPUBCHECK_VERSION}.zip" \
        --output /tmp/epubcheck.zip; \
    mkdir -p /tmp/epubcheck-dist; \
    unzip -q /tmp/epubcheck.zip -d /tmp/epubcheck-dist; \
    EPUBCHECK_JAR="$(find /tmp/epubcheck-dist -type f -name epubcheck.jar -print -quit)"; \
    if [ -z "$EPUBCHECK_JAR" ]; then \
        echo "ERREUR : epubcheck.jar absent de l'archive téléchargée" >&2; \
        find /tmp/epubcheck-dist -maxdepth 3 -type f >&2; \
        exit 1; \
    fi; \
    cp -a "$(dirname "$EPUBCHECK_JAR")"/. /opt/epubcheck/; \
    java -jar /opt/epubcheck/epubcheck.jar --version; \
    rm -rf /tmp/epubcheck.zip /tmp/epubcheck-dist

WORKDIR /data

ENTRYPOINT ["java", "-jar", "/opt/epubcheck/epubcheck.jar"]
