export function createMap(data:any[], field:string) {

  const map:any = {}

  for (const item of data) {
    map[item[field]] = item.id
  }

  return map

}