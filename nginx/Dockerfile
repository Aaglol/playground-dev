FROM nginx:latest
RUN echo 'foo'
COPY default.conf /etc/nginx/conf.d/default.conf
COPY init-letsencrypt.sh /etc/init-letsencrypt.sh
RUN echo 'bar'