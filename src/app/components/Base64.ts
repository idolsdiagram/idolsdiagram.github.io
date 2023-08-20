/**
 * 文字列をBase64エンコードする
 * @param str 文字列
 */
export function encodeBase64(str: string) {
    return Buffer.from(str).toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/g, '')
}

/**
 * Base64エンコードされた文字列をデコードする
 * @param str Base64エンコードされた文字列
 */
export function decodeBase64(str: string) {
    return Buffer.from(str.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8')
}