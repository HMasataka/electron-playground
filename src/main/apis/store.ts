import { net } from 'electron'

export function getHello(name: string): string {
  return `Hello, ${name}!`
}

export async function getZipCode(): Promise<string> {
  const request = await net.fetch('https://zipcloud.ibsnet.co.jp/api/search?zipcode=1000001', {
    method: 'GET'
  })
  if (!request.ok) {
    console.error(`HTTP error! status: ${request.status}`)
    return ''
  }

  return 'success'
}
