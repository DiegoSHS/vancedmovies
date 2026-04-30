/**
 * Source - https://stackoverflow.com/a/19707059
 * Posted by Jimbo, modified by community.
 * See post 'Timeline' for change history
 * Retrieved 2026-04-02, License - CC BY-SA 4.0
 */
const magnetRegExp = /magnet:\?xt=urn:[a-z0-9]+:[a-z0-9]{32}/i

export const checkMagnet = (magnet: string) => {
    return magnet.match(magnetRegExp)
}

export default checkMagnet