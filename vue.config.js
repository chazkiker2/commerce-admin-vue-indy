const version = require("./package.json").version;
const fs = require("fs");

process.env.VUE_APP_STATIC_FILE_VERSION = version;

const keyPath = "/usr/local/etc/nginx/ssl/marketing-tools.key";
const certPath = "/usr/local/etc/nginx/ssl/marketing-tools.cert";

var httpsSetting = {
    key: keyPath,
    cert: certPath,
};
if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
    console.log("***********************************");
    console.log("WARNING: cert files not found. See project readme on how to create cert files.");
    console.log("***********************************");
    httpsSetting = true;
}

module.exports = {
    pluginOptions: {
        webpack: {
            dir: ["./webpack"],
        },
    },

    devServer: {
        disableHostCheck: true,
        port: 8016,
        https: httpsSetting,
    },
};
