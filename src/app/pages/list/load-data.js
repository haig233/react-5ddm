import { listLoad } from '@/store/actions/list'
import { configLoad } from '@/store/actions/config'
import cache from '@/utils/cache'
const { getCache, addCache } = cache

function isEmpty(val, type) {
  return val === undefined || val === '' || val === '-' ? (type ? 'addtime' : '') : val
}

const type = {
  tv: 201,
  ova: 202,
  juchang: 203,
  tebie: 4,
  zhenren: 204,
  qita: 35
}

export default async ({ store, match }) => {
  const { name, mcid, year, area, wd = '', order, letter, lz } = match.params
  const id = type[name] || 3
  const reduxName =
    id + isEmpty(mcid) + isEmpty(year) + isEmpty(area) + isEmpty(decodeURIComponent(wd)) + isEmpty(letter) + isEmpty(lz) + isEmpty(order, 1)
  // console.log(reduxName)
  const data = getCache('list')
  if (data) {
    store.dispatch({
      type: 'GET_LIST',
      name: reduxName,
      data: data[0][1]
    })
    store.dispatch({
      type: 'GET_CONFIG',
      name: 'list',
      data: data[1][1]
    })
    return { code: 200 }
  }
  const listData = await listLoad({
    id,
    mcid: isEmpty(mcid),
    year: isEmpty(year),
    area: isEmpty(area),
    wd: isEmpty(wd),
    letter: isEmpty(letter),
    lz: isEmpty(lz),
    order: isEmpty(order, 1)
  })(store.dispatch, store.getState)
  const configData = await configLoad({ tag: 'list' })(store.dispatch, store.getState)
  addCache('list', [listData[1], configData[1]])
  return { code: 200 }
}
