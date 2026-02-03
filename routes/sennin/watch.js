const express = require("express");
const router = express.Router();
const senninYt = require("../../server/sennin-youtube.js");
const senninStream = require("../../server/sennin.js");

router.get('/:id', async (req, res) => {
  const videoId = req.params.id;

  if (!/^[\w-]{11}$/.test(videoId)) {
    return res.status(400).send("videoIDが正しくありません");
  }

  try {
    const videoData = await senninStream.getYouTube(videoId);
    const Info = await senninYt.infoGet(videoId);

    const videoInfo = {
      title: Info.primary_info.title.text || "",
      channelId: Info.secondary_info.owner.author.id || "",
      channelIcon: Info.secondary_info.owner.author.thumbnails[0].url || "",
      channelName: Info.secondary_info.owner.author.name || "",
      channelSubsc: Info.secondary_info.owner.subscriber_count.text || "",
      published: Info.primary_info.published,
      viewCount:
        Info.primary_info.view_count.short_view_count?.text ||
        Info.primary_info.view_count.view_count?.text ||
        "",
      likeCount:
        Info.primary_info.menu.top_level_buttons.short_like_count ||
        Info.primary_info.menu.top_level_buttons.like_count ||
        "",
      description: Info.secondary_info.description.text || "",
      watch_next_feed: Info.watch_next_feed || ""
    };

    res.render("tube/watch.ejs", {
      videoData,
      videoInfo,
      videoId,
      baseUrl: "direct"
    });
  } catch (e) {
    res.status(500).render("tube/mattev.ejs", {
      videoId,
      error: "動画を取得できません",
      details: e.message
    });
  }
});

module.exports = router;
