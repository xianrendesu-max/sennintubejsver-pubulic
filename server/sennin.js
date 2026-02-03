const axios = require("axios");

let apis = [];
let lastUpdate = 0;

async function getApis() {
  const urls = [
    "https://raw.githubusercontent.com/sennin02/sennin-top/refs/heads/main/api.txt",
    "https://gitlab.com/sennin02/sennin-top/-/raw/main/api.txt"
  ];

  for (const url of urls) {
    try {
      const res = await axios.get(url, { timeout: 5000 });
      if (res.data) {
        apis = res.data.split("\n").filter(Boolean);
        lastUpdate = Date.now();
        return;
      }
    } catch (e) {
      console.log("sennin api error:", e.message);
    }
  }
}

async function getYouTube(id) {
  if (!apis.length || Date.now() - lastUpdate > 1000 * 60 * 30) {
    await getApis();
  }

  let lastError;
  for (const api of apis) {
    try {
      const res = await axios.get(`${api}/api/v1/videos/${id}`, { timeout: 5000 });
      return res.data;
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError;
}

async function ggvideo(id) {
  return getYouTube(id);
}

module.exports = {
  getYouTube,
  ggvideo,
  getApis
};
