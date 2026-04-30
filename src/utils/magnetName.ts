export const getQualityFromName = (name: string) => {
    return name.match(/(\d{3,4}p)/)?.[1] || 'HD'
}

export default getQualityFromName