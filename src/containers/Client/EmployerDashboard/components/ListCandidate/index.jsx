import { ExclamationCircleOutlined } from '@ant-design/icons'
import {
  Button,
  Col,
  Drawer,
  Form,
  Input,

  Modal, Pagination,
  Row,
  Skeleton,
} from 'antd'
import { DataNull } from 'components/DataNull'
import DetailCv from 'containers/Client/CandidateDashboard/components/ListCv/DetailCv'
import { toastWarning } from 'helpers/toastify'
import { get } from 'lodash'
import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/esm/Container'
import { useDispatch, useSelector } from 'react-redux'
import { userIDSelector } from 'stores/moduleAuth/selectors'
import { dispatchDeleteApplyJobRequest } from 'stores/moduleCandidate/thunks'
import { detailCVSelector } from 'stores/moduleCv/selectors'
import { dispatchFetchDetailCvRequest } from 'stores/moduleCv/thunks'
import { infoEmployerSelector, listCvAppliedSelector } from 'stores/moduleEmployer/selectors'
import { deleteAppliedJob, dispatchFetchListCvAppliedRequest, dispatchSendMailInterView } from 'stores/moduleEmployer/thunks'
import { v4 } from 'uuid'

import '../ListJobEmployer/style.scss'
import './style.scss'

export default function ListCandidateDB() {
  const userID = useSelector(userIDSelector)
  const dispatch = useDispatch()
  const listCv = useSelector(listCvAppliedSelector)
  const infoEmployer = useSelector(infoEmployerSelector)

  const [current, setCurrent] = useState(1)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    dispatch(dispatchFetchListCvAppliedRequest({
      id: userID, name: '', limit: 5, page: 1,
    }))
  }, [dispatch])

  const [formState, setFormState] = useState({
    name: '',
  })

  const handleChangeName = (event) => {
    const { value } = event.target
    setFormState(() => ({
      ...formState,
      name: value,
    }))
  }

  const onFinish = () => {
    setCurrent(1)
    dispatch(dispatchFetchListCvAppliedRequest({
      id: userID, name: formState.name, limit: 5, page: 1,
    }))
  }

  const handleChangePage = (value) => {
    setCurrent(value)
    dispatch(dispatchFetchListCvAppliedRequest({
      id: userID, name: formState.name, limit: 5, page: 1,
    }))
  }

  const { data = [] } = listCv

  const showDrawer = (value) => {
    dispatch(dispatchFetchDetailCvRequest(value.cv_id))
    setVisible(true)
  }
  const onClose = () => {
    setVisible(false)
  }

  const detailCV = useSelector(detailCVSelector)

  const title = detailCV.title
    ? `Chi ti????t CV: ${detailCV.title}`
    : ''

  const handelDelete = (cv) => {
    setCurrent(1)
    const totalData = {
      ...cv,
      ...infoEmployer,
      email: get(detailCV, 'object.dataUser.email'),
      position: get(detailCV, 'object.dataUser.position'),
    }
    dispatch(deleteAppliedJob(cv.id, totalData))
  }

  const handleDeleteApplyJob = (cv) => {
    dispatch(dispatchFetchDetailCvRequest(cv.cv_id))
    Modal.confirm({
      title: 'Th??ng b??o',
      icon: <ExclamationCircleOutlined />,
      content: 'B???n c?? mu???n t??? ch???i cv n??y ?',
      okText: 'T??? ch???i',
      onOk: () => handelDelete(cv),
      cancelText: 'H???y',
    })
  }

  const handleSendMail = (cv) => {
    const totalData = {
      ...cv,
      ...infoEmployer,
      email: get(detailCV, 'object.dataUser.email'),
      position: get(detailCV, 'object.dataUser.position'),
    }
    if (get(detailCV, 'object.dataUser.email')) { dispatch(dispatchSendMailInterView(totalData)) } else {
      toastWarning('C?? m???t v??i s??? c??? nh???. Vui l??ng g???i l???i.')
    }
  }

  const handleSend = (cv) => {
    dispatch(dispatchFetchDetailCvRequest(cv.cv_id))
    Modal.confirm({
      title: 'Th??ng b??o',
      icon: <ExclamationCircleOutlined />,
      content: `G???i mail t???i ???ng vi??n ${cv.name}`,
      okText: 'Xa??c nh????n',
      onOk: () => handleSendMail(cv),
      cancelText: 'H???y',
    })
  }

  const renderData = () => {
    let jsx = []
    jsx = data.map((value) => (
      <div key={v4()} className="listCandidatesDb">
        <Row className="listCandidatesDb__content">
          <Col className="listCandidatesDb__content-avatar" span={5}>
            <img src={value.avatar} alt="avatar" />
          </Col>
          <Col className="listCandidatesDb__content-title" span={15}>
            <h5>{value.name}</h5>
            <Row>
              <Col span={12}>
                <p>
                  S??T:
                  {value.phone}
                </p>
                <p>
                  ??i??a chi??:
                  {value.address}
                </p>
              </Col>
              <Col span={12}>
                <p>
                  Kinh Nghi????m:
                  {value.experience}
                </p>
                <p>
                  V??? tr??:
                  {value.position}
                </p>
                <p>
                  T??n job:
                  {value.vacancy}
                </p>
              </Col>
            </Row>
          </Col>
          <Col className="listCandidatesDb__content-button" span={4}>
            <Button type="primary" onClick={() => showDrawer(value)}>
              Xem CV
            </Button>
            <Button type="primary" onClick={() => handleSend(value)}>
              G???i th?? m???i
            </Button>
            <Button
              type="primary"
              onClick={() => handleDeleteApplyJob(value)}
            >
              T??? ch???i
            </Button>
          </Col>
        </Row>
      </div>
    ))
    return jsx
  }

  const lazyLoadingDataNull = () => (
    <>
      <Skeleton active />
      <Skeleton active />
      <Skeleton active />
    </>
  )

  return (
    <Container>
      <div className="list-employer-db__search">
        <Drawer
          title={title}
          width={1100}
          closable
          onClose={onClose}
          visible={visible}
          className="drawer-cv"
          footer={(
            <div
              style={{
                textAlign: 'right',
              }}
            >
              <Button onClick={onClose} style={{ marginRight: 8 }}>
                H???y
              </Button>
              {/* <Button type="primary">T???i xu???ng</Button> */}
            </div>
          )}
        >
          <DetailCv detailCV={detailCV} />
        </Drawer>
        <Form
          className="list-employer-db__search-form"
          style={{ height: '32px' }}
          onFinish={onFinish}
        >
          <Form.Item
            name="name"
            className="list-employer-db__search-form-input"
            onChange={handleChangeName}
          >
            <Input placeholder="T??m ki???m ???ng vi??n" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              T??m ki???m
            </Button>
          </Form.Item>
        </Form>
      </div>
      { data.length ? renderData() : <DataNull />}

      {data.length === 0 ? (
        ''
      ) : (
        <div className="custom-pgtion">
          <Pagination
            onChange={handleChangePage}
            defaultCurrent={1}
            defaultPageSize={5}
            total={listCv.total}
            current={current}
          />
        </div>
      )}
    </Container>
  )
}
