FROM node:4.0.0-onbuild

# ----------------------------------------------------------
# Create directories
# ----------------------------------------------------------
RUN mkdir -p /usr/backup/
RUN mkdir -p /usr/cfg/
RUN mkdir -p /usr/work/
RUN chmod 777 -R /usr/work/

# ----------------------------------------------------------
# Copy default config file
# ----------------------------------------------------------
ONBUILD COPY ./specs/config.sample.json /usr/cfg/config.json

# ----------------------------------------------------------
# Add volumes
# ----------------------------------------------------------
VOLUME ['/usr/backup/', '/usr/cfg/config.json']

# ----------------------------------------------------------
# Remove git directory
# ----------------------------------------------------------
RUN rm -R /usr/src/app/.git

EXPOSE 8080
