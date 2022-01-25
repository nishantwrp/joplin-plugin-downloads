const axios = require("axios").default;

module.exports = async (req, res) => {
    const { data } = axios.get("https://raw.githubusercontent.com/joplin/plugins/master/stats.json");
    const allPluginReleases = data["joplin.plugin.templates"];
    let totalDownloads = 0;
    for (const o of Object.values(allPluginReleases)) {
        totalDownloads += o.downloadCount;
    }
    res.json({ downloads: totalDownloads });
}
