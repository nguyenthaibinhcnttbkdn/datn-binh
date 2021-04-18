import intersection from 'lodash/intersection'

export function isArrayWithLength(arr) {
  return (Array.isArray(arr) && arr.length)
}

export function getAllowedRoutes(routes) {
  const roles = JSON.parse(localStorage.getItem('roles'))
  return routes.filter(({ permission }) => {
    if (!permission) return true
    if (!isArrayWithLength(permission)) return true
    return intersection(permission, roles).length
  })
}
