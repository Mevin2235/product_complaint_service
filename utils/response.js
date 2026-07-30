// =====================================================
// utils/response.js
// =====================================================

class Response {

    success(res, message, data = {}) {

        return res.status(200).json({

            success: true,

            message,

            data

        });

    }

    created(res, message, data = {}) {

        return res.status(201).json({

            success: true,

            message,

            data

        });

    }

    badRequest(res, message) {

        return res.status(400).json({

            success: false,

            message

        });

    }

    unauthorized(res, message) {

        return res.status(401).json({

            success: false,

            message

        });

    }

    notFound(res, message) {

        return res.status(404).json({

            success: false,

            message

        });

    }

    serverError(res, message, error = null) {

        return res.status(500).json({

            success: false,

            message,

            error

        });

    }

}

module.exports = new Response();