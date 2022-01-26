const axios = require("axios").default;

const getPluginDownloads = (allReleases) => {
    let totalDownloads = 0;
    let latestRelease = null;

    Object.entries(allReleases).forEach(([release, details]) => {
        totalDownloads += details.downloadCount;
        latestRelease = {
            version: release,
            ...details,
        };
    });

    return {
        totalDownloads,
        latestRelease,
        allReleases,
    };
}

module.exports = async (req, res) => {
    const pluginId = req.query?.plugin;
    const { data } = await axios.get("https://raw.githubusercontent.com/joplin/plugins/master/stats.json");

    if (pluginId) {
        if (Object.keys(data).includes(pluginId)) {
            res.json(getPluginDownloads(data[pluginId]));
        } else {
            res.status(404);
            res.json({ error: 'No plugin with this id found!' });
        }
    } else {
        const allPlugins = {};
        Object.entries(data).forEach(([plugin, releaseData]) => {
            allPlugins[plugin] = getPluginDownloads(releaseData);
        });
        res.json(allPlugins);
    }
}
