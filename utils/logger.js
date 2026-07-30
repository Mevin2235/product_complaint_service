// =====================================================
// utils/logger.js
// =====================================================

class Logger {

    info(message) {
        console.log(
            `[INFO] ${new Date().toLocaleString()} - ${message}`
        );
    }

    success(message) {
        console.log(
            `[SUCCESS] ${new Date().toLocaleString()} - ${message}`
        );
    }

    warning(message) {
        console.warn(
            `[WARNING] ${new Date().toLocaleString()} - ${message}`
        );
    }

    error(message, error = null) {

        console.error(
            `[ERROR] ${new Date().toLocaleString()} - ${message}`
        );

        if (error) {
            console.error(error);
        }

    }

    api(title, url) {

        console.log("\n======================================");
        console.log(title);
        console.log("======================================");
        console.log(`URL : ${url}`);
        console.log("======================================");

    }

}

module.exports = new Logger();