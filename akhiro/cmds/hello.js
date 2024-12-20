module.exports = {
  config: {
    name: "hello",
    description: "A simple hello world command",
    usage: "hello",
    author: "Vin-cent",
    aliases: ["hi", "greet"],
  },
  onRun: async ({ api, event, args }) => {
    api.sendMessage("Hello, World!", event.threadID);
  },
};
