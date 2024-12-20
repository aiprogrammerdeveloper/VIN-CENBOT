const axios = require("axios");

module.exports.config = {
  name: "Yanzen",
  author: "Vin-cent",
  role: 0,
  usage: "Yanzen [prompt]",
};

module.exports.onRun = async ({ api, event, args }) => {
  try {
    const query = args.join(" ") || "hello";
    const data = await api.getUserInfo(event.senderID);
    const { name } = data[event.senderID];

    if (query) {
      api.setMessageReaction(
        "⏳",
        event.messageID,
        (err) => console.log(err),
        true,
      );
      const processingMessage = await api.sendMessage(
        `Asking 🔎 Yanzen. Please wait a moment...`,
        event.threadID,
      );

      const apiUrl = `https://lianeapi.onrender.com/@LianeAPI_Reworks/api/nica?userName=${encodeURIComponent(name)}&key=j86bwkwo-8hako-12C&query=${encodeURIComponent(query)}`;
      const response = await axios.get(apiUrl);

      if (response.data && response.data.message) {
        const trimmedMessage = response.data.message.trim();
        api.setMessageReaction(
          "✅",
          event.messageID,
          (err) => console.log(err),
          true,
        );
        await api.sendMessage(
          { body: trimmedMessage },
          event.threadID,
          event.messageID,
        );

        console.log(`Sent 🔎 Nica's response to the user`);
      } else {
        throw new Error(`Invalid or missing response from 🔎 Nica API`);
      }

      await api.unsendMessage(processingMessage.messageID);
    }
  } catch (error) {
    console.error(`❌ | Failed to get 🔎 Nica's response: ${error.message}`);
    const errorMessage = `❌ | An error occurred. You can try typing your query again or resending it. There might be an issue with the server that's causing the problem, and it might resolve on retrying.`;
    api.sendMessage(errorMessage, event.threadID);
  }
};
