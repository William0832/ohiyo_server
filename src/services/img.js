import imgur from 'imgur'

const imgurClient = new imgur.ImgurClient({
  clientId: process.env.IMGUR_CLIENT_ID
})

export const uploadImgs = async (file) => {
  try {
    const { name } = file
    const res = await imgurClient.upload(
      { image: file.data, type: 'stream' }
    )
    const { id, link } = res.data
    return { id, link }
  } catch (err) {
    console.error(err.message.red)
  }
}
