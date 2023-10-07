import imgur from 'imgur'

const imgurClient = new imgur.ImgurClient({
  clientId: process.env.IMGUR_CLIENT_ID,
  clientSecret: process.env.IMGUR_CLIENT_SECRET,
  refreshToken: process.env.IMGUR_REFRESH_TOKEN
})

export const uploadImgs = async (file) => {
  try {
    if (!file) return
    const res = await imgurClient.upload(
      {
        image: file.data,
        type: 'stream',
        album: process.env.IMG_ALBUM_ID
      }
    )
    const { id, link } = res.data
    return { id, link }
  } catch (err) {
    throw new Error(err.message)
  }
}
