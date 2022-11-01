FROM denoland/deno:alpine-1.27.0

# The port that your application listens to.
EXPOSE 8887

WORKDIR /app

# Prefer not to run as root.
USER deno

# Cache the dependencies as a layer (the following two steps are re-run only when deps.ts is modified).
# Ideally cache deps.ts will download and compile _all_ external files used in main.ts.
COPY deps.js .
RUN deno cache deps.js

# These steps will be re-run upon each file change in your working directory:
ADD . .
# Compile the main app so that it doesn't need to be compiled each startup/entry.
RUN deno cache index.js

CMD ["run", "--allow-net", "index.js"]