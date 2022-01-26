const axios = require("axios").default;
const compareVersions = require("compare-versions");

const getPluginDownloads = (allReleases) => {
    let totalDownloads = 0;
    Object.entries(allReleases).forEach(([release, details]) => {
        totalDownloads += details.downloadCount;
    });

    const latestReleaseVersion = Object.keys(allReleases).sort(compareVersions).slice(-1)[0] ;
    const latestRelease = {
        version: latestReleaseVersion,
        ...allReleases[latestReleaseVersion],
    };

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
