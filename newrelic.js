'use strict'

exports.config = {
    app_name: ['blog-api'],
    license_key: process.env.NEW_RELIC_LICENSE_KEY,
    logging: {
        level: 'info'
    },

    application_logging: {
        forwarding: {
            enabled: true
        },

        metrics: {
            enabled: true
        },

        local_decorating: {
            enabled: true
        }
    }
}