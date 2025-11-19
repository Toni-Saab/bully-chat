//@ts-check
const { withNx } = require('@nx/next')

/** @type {import('@nx/next/plugins/with-nx').WithNxOptions} */
const nextConfig = {
  nx: {}
}

module.exports = withNx(nextConfig)
