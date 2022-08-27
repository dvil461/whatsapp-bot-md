FROM quay.io/lyfe00011/md:beta
RUN git clone https://github.com/dvil461/whatsapp-bot-md.git /root/Devil/
WORKDIR /root/Devil/
RUN yarn install --network-concurrency 1
CMD ["node", "index.js"]
