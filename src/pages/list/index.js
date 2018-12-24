import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { configLoad } from '@/store/actions/config'
import { getConfig } from '@/store/reducers/config'

import List from '@/components/List'
import Shell from '@/components/Shell'
import Meta from '@/components/Meta'

import './style.scss'

@Shell
@withRouter
@connect(
  (state, props) => ({
    config: getConfig(state, 'list')
  }),
  dispatch => ({
    configLoad: bindActionCreators(configLoad, dispatch)
  })
)
class SubjectList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      lz: '',
      mcid: '',
      area: '',
      year: '',
      letter: '',
      limit: 30,
      order: 'addtime',
      day: 365,
      id: 3
    }
  }

  static propTypes = {
    location: PropTypes.object,
    match: PropTypes.object,
    configLoad: PropTypes.func,
    config: PropTypes.object,
    history: PropTypes.object
  }

  componentDidMount() {
    const {
      config,
      configLoad,
      match: {
        params: { name, mcid, area, year, letter, lz, order },
        url
      }
    } = this.props
    if (!config.data) {
      configLoad({ name: 'list' })
    }
    if (name) {
      let id = ''
      const type = name
      switch (name) {
        case 'tv':
          id = 201
          break
        case 'ova':
          id = 202
          break
        case 'juchang':
          id = 203
          break
        case 'tebie':
          id = 4
          break
        case 'zhenren':
          id = 204
          break
        case 'qita':
          id = 35
          break
        default:
          id = 3
          break
      }
      this.setState(
        url.indexOf('type/') === -1
          ? { id, type }
          : {
              id,
              type,
              mcid,
              area,
              year,
              letter,
              lz,
              order
            }
      )
    }
  }

  getName(data, id) {
    for (let i of data) {
      if (i.id === id) {
        return i.title
      }
    }
  }

  getParams(type, value, title) {
    const {
      match: { url }
    } = this.props
    this.setState(
      {
        [type]: value === '全部' ? '' : value,
        [`${type}Name`]: title || ''
      },
      () => {
        if (url.indexOf('type/') !== -1) {
          const old = JSON.parse(localStorage.typeParams || JSON.stringify(this.state))
          const keys = Object.keys(old)
          let newData = this.state
          for (let i = 0; i < keys.length; i++) {
            if (newData[keys[i]] !== old[keys[i]] && newData[keys[i]] !== '') {
              old[keys[i]] = newData[keys[i]]
            }
          }
          localStorage.typeParams = JSON.stringify(old)
          const { type, mcid, area, year, letter, lz, order } = old
          this.setState({ type, mcid, area, year, letter, lz, order }, () => {
            const path = `/type/${type}/${mcid || '-'}/${area || '-'}/${year || '-'}/${letter || '-'}/${lz || '-'}/${order}`
            this.props.history.push(path)
          })
        }
      }
    )
  }

  formatArray(data = []) {
    let f = []
    for (let i of data) {
      f.push({ title: i, id: i })
    }
    return f
  }

  isSearch() {
    const {
      location: { pathname },
      match: {
        params: { wd = '' }
      }
    } = this.props
    const isSearch = pathname.indexOf('search') !== -1
    return {
      wd,
      isSearch
    }
  }

  render() {
    const {
      config: { data = {} },
      match: {
        params: { name }
      }
    } = this.props
    const {
      id,
      type,
      mcid,
      area,
      year,
      letter,
      lz,
      day,
      order,
      limit,
      idName,
      mcidName,
      areaName,
      yearName,
      letterName,
      lzName
    } = this.state
    const { wd, isSearch } = this.isSearch()
    const idArr = (data.menu || {}).son || []
    const mcidArr = data.mcid || []
    const areaArr = this.formatArray(data.area)
    const yearArr = this.formatArray(data.year)
    const letterArr = this.formatArray(data.letter)
    const lzArr = [{ title: '全部', id: '' }, { title: '连载', id: 1 }, { title: '完结', id: 2 }]
    const orderArr = [{ title: '最新', id: 'addtime' }, { title: '评分', id: 'gold' }, { title: '热门', id: 'hits' }]
    const keyword = decodeURIComponent(wd)
    return (
      <Fragment>
        {isSearch ? <h2>{keyword}</h2> : null}
        <Meta title={isSearch ? `你搜索的是${keyword}` : '动漫列表'} />
        <div styleName="filter">
          <div className="wp">
            {(type || mcid || area || year || letter || lz) && (
              <ul>
                已选：
                {idName ? <li onClick={() => this.getParams('type', '')}>{idName}</li> : null}
                {mcidName ? <li onClick={() => this.getParams('mcid', '')}>{mcidName}</li> : null}
                {lzName ? <li onClick={() => this.getParams('lz', '')}>{lzName}</li> : null}
                {areaName ? <li onClick={() => this.getParams('area', '')}>{areaName}</li> : null}
                {yearName ? <li onClick={() => this.getParams('year', '')}>{yearName}</li> : null}
                {letterName ? <li onClick={() => this.getParams('letter', '')}>{letterName}</li> : null}
              </ul>
            )}
            {name ? null : (
              <ul>
                {idArr.map(item => (
                  <li
                    styleName={type === item.name ? 'cur' : ''}
                    onClick={() => this.getParams('type', item.name, item.title)}
                    key={item.name}
                  >
                    {item.title}
                  </li>
                ))}
              </ul>
            )}
            <ul>
              {mcidArr.map(item => (
                <li styleName={mcid === item.id ? 'cur' : ''} onClick={() => this.getParams('mcid', item.id, item.title)} key={item.id}>
                  {item.title}
                </li>
              ))}
            </ul>
            <ul>
              {lzArr.map(item => (
                <li styleName={lz === item.id ? 'cur' : ''} onClick={() => this.getParams('lz', item.id, item.title)} key={item.id}>
                  {item.title}
                </li>
              ))}
            </ul>
            <ul>
              {areaArr.map(item => (
                <li styleName={area === item.id ? 'cur' : ''} onClick={() => this.getParams('area', item.id, item.title)} key={item.id}>
                  {item.title}
                </li>
              ))}
            </ul>
            <ul>
              {yearArr.map(item => (
                <li styleName={year === item.id ? 'cur' : ''} onClick={() => this.getParams('year', item.id, item.title)} key={item.id}>
                  {item.title}
                </li>
              ))}
            </ul>
            <ul>
              {letterArr.map(item => (
                <li styleName={letter === item.id ? 'cur' : ''} onClick={() => this.getParams('letter', item.id, item.title)} key={item.id}>
                  {item.title}
                </li>
              ))}
            </ul>
            <ul>
              {orderArr.map(item => (
                <li styleName={order === item.id ? 'cur' : ''} onClick={() => this.getParams('order', item.id, item.title)} key={item.id}>
                  {item.title}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <List
          stateId="list"
          id={id}
          mcid={mcid}
          year={year}
          area={area}
          wd={wd || ''}
          letter={letter}
          lz={lz}
          day={day}
          order={order}
          limit={limit}
          scrollLoad={true}
        />
      </Fragment>
    )
  }
}

export default SubjectList
