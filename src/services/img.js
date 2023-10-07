import imgur from 'imgur'

const imgurClient = new imgur.ImgurClient({
  clientId: process.env.IMGUR_CLIENT_ID
})

export const uploadImgs = async (file) => {
  try {
    if (!file) return
    const res = await imgurClient.upload(
      { image: file.data, type: 'stream' }
    )
    const { id, link } = res.data
    console.log(res)
    return { id, link }
  } catch (err) {
    console.error(err.message.red)
  }
}
