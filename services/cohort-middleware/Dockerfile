

FROM node:16.14-alpine3.14

ARG GIT_SHA=latest
ENV GIT_SHA="${GIT_SHA}"
ENV PORT=3000

RUN addgroup -S nodegroup && adduser -S -G node nodegroup

RUN chown -R node:nodegroup /home/node/
#RUN rm -rf /home/node/dist

USER node
COPY --chown=node:nodegroup ./tools/lib/deploy/entrypoint.sh /home/node/
RUN ["chmod", "+x", "/home/node/entrypoint.sh"]

WORKDIR /home/node/
RUN ["chown", "-R", "node:nodegroup", "/home/node/"]

COPY --chown=node:nodegroup . .

ENV PATH=/home/node/node_modules/.bin:$PATH


#RUN ["ls", "-al",  "/home/node/"]
# RUN ["chmod", "-R", "oug+rx", "/home/node/src/"]

EXPOSE 3000
ENTRYPOINT ["/home/node/entrypoint.sh"]
