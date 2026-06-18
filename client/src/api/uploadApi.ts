import api from './index'

export const uploadImages = async (files: FileList) => {
  const formData = new FormData()

  Array.from(files).forEach((file) => {
    formData.append('images', file)
  })

  console.log('FormData entries:')
  for (const pair of formData.entries()) {
    console.log(pair[0], pair[1])
  }

  const { data } = await api.post('/upload', formData)
  return data.urls
}