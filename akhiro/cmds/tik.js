const fs = require("fs");
const axios = require("axios");

module.exports.config = {
  name: "tik",
  role: 0,
  credits: "Vin-cent",
  description: "Download TikTok videos",
  usage: "tik video <link>\ntik audio <link>",
};

module.exports.onRun = async function ({ api, event, args }) {
  if (!args[0]) {
    api.sendMessage(
      `Usage: ${global.AkhiroBot.botPrefix}tik video <link>\n${global.config.PREFIX}tik audio <link>`,
      event.threadID,
      event.messageID,
    );
  } else if (args[0] === "video" || args[0] === "audio") {
    const mediaType = args[0];
    const path =
      __dirname + `/cache/tik.${mediaType === "video" ? "mp4" : "mp3"}`;
    const url = args[1];

    try {
      api.sendMessage(
        `Downloading ${mediaType === "video" ? "video" : "audio"}, please wait...`,
        event.threadID,
        event.messageID,
      );
      const response = await axios.get(
        `https://eurix-hiyoshi-apis.replit.app/tiktokdl?url=${url}`,
      );
      const mediaUrl = response.data.data.play;
      const userName = response.data.data.author.unique_id || "No data";
      const usernickname = response.data.data.author.nickname || "No data";
      const title = response.data.data.title || "No data";
      const id = response.data.data.id || "No data";
      const likes = response.data.data.digg_count || "No data";
      const comments = response.data.data.comment_count || "No data";
      const share = response.data.data.share_count || "No data";
      const views = response.data.data.play_count || "No data";

      const mediaResponse = await axios.get(mediaUrl, {
        responseType: "stream",
      });
      const writer = fs.createWriteStream(path);

      mediaResponse.data.pipe(writer);

      writer.on("finish", function () {
        api.sendMessage(
          {
            body: `Downloaded Successfully.\nUsername: @${userName}\nNickname: ${usernickname}\nTitle: ${title}\nUserID: ${id}\nLikes: ${likes}\nComments: ${comments}\nShare: ${share}\nViews: ${views}`,
            attachment: fs.createReadStream(path),
          },
          event.threadID,
          event.messageID,
        );
      });
    } catch (error) {
      console.error("Error downloading TikTok media:", error);
      api.sendMessage(
        "Failed to download TikTok media. Please check the provided link.",
        event.threadID,
        event.messageID,
      );
    }
  } else {
    api.sendMessage(
      `Invalid command. Usage: ${global.AkhiroBot.botPrefix}tik video <link>\n${global.AkhiroBot.botPrefix}tik audio <link>`,
      event.threadID,
      event.messageID,
    );
  }
};
