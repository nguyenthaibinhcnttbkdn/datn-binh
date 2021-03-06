import { ExclamationCircleOutlined } from '@ant-design/icons'
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Pagination,
  Row,
  Select,
  Skeleton,
} from 'antd'
import { DataNull } from 'components/DataNull'
import history from 'helpers/history'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { userIDSelector } from 'stores/moduleAuth/selectors'
import { listRecruitmentByUserIDSelector } from 'stores/moduleRecruitment/selectors'
import { dispatchDeleteRecruitmentRequest, dispatchfetchLitsRecruitmentByUserID } from 'stores/moduleRecruitment/thunks'
import styled from 'styled-components'
import { v4 } from 'uuid'
import './style.scss'

function ListJobEmployer() {
  const { Option } = Select
  const userID = useSelector(userIDSelector)

  const [current, setCurrent] = useState(1)

  const dispatch = useDispatch()
  const recruitmentbyuserid = useSelector(listRecruitmentByUserIDSelector)
  useEffect(() => {
    dispatch(dispatchfetchLitsRecruitmentByUserID({
      id: userID, vacancy: '', active: '', limit: 5, page: 1,
    }))
  }, [dispatch])

  const [formState, setFormState] = useState({
    vacancy: '',
    active: '',
  })

  const handleChangeVacancy = (event) => {
    const { value } = event.target
    setFormState(() => ({
      ...formState,
      vacancy: value,
    }))
  }

  const handleChangeActive = (event) => {
    setFormState(() => ({
      ...formState,
      active: event,
    }))
  }

  const onFinish = () => {
    setCurrent(1)
    dispatch(
      dispatchfetchLitsRecruitmentByUserID(
        {
          id: userID,
          vacancy: formState.vacancy,
          active: formState.active,
          limit: 5,
          page: 1,
        },
      ),
    )
  }

  const handleChangePage = (value) => {
    setCurrent(value)
    dispatch(
      dispatchfetchLitsRecruitmentByUserID(
        {
          id: userID,
          vacancy: formState.vacancy,
          active: formState.active,
          limit: 5,
          page: value,
        },
      ),
    )
  }

  const handleEditRecruitment = (id) => {
    history.push(`/employer-dashboard/list-job/edit/${id}`)
  }

  const handelDelete = (id) => {
    setCurrent(1)
    dispatch(dispatchDeleteRecruitmentRequest(id))
  }

  const handleDeleteRecruitment = (value) => {
    Modal.confirm({
      title: 'Th??ng b??o',
      icon: <ExclamationCircleOutlined />,
      content: `B???n c?? mu???n x??a ${value.vacancy}`,
      okText: 'X??a',
      onOk: () => handelDelete(value.id),
      cancelText: 'H???y',
    })
  }

  const { data = [] } = recruitmentbyuserid
  const renderData = () => {
    let jsx = []
    jsx = data.map((value) => (
      <div key={v4()}>
        <DivSucces data={value.active}>
          <Row className="list-employers-content">
            <Col className="list-employers-content-avatar" span={5}>
              <img src={value.photo} alt="avatar" />
            </Col>
            <Col className="list-employers-content-title" span={15}>
              <h5>{value.vacancy}</h5>
              <Row className="list-employers-content-title-dung">
                <Col span={12}>
                  <p>
                    M???c l????ng:
                    {value.salary}
                  </p>
                  <p>
                    S??? l?????ng:
                    {value.quantity}
                  </p>
                </Col>
                <Col span={12}>
                  <p>
                    <TextSucces data={value.active}>
                      {value.active === 1 ? ' ???? duy???t' : ' Ch??a duy???t'}
                    </TextSucces>
                  </p>
                  <p>
                    Th??nh ph???:
                    {value.city}
                  </p>
                </Col>
              </Row>
            </Col>
            <Col className="list-employers-content-button" span={4}>
              <Button
                type="primary"
                onClick={() => handleEditRecruitment(value.id)}
              >
                Ch???nh s???a
              </Button>

              <Button
                type="primary"
                onClick={() => handleDeleteRecruitment(value)}
              >
                Xo??
              </Button>
            </Col>
          </Row>
        </DivSucces>
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
    <div className="list-employer-db">
      <div className="list-employer-db__search">
        <Form
          onFinish={onFinish}
          className="list-employer-db__search-form"
          style={{ height: '32px' }}
        >
          <Form.Item
            name="vacancy"
            className="list-employer-db__search-form-input"
            onChange={handleChangeVacancy}
          >
            <Input placeholder="T??m ki???m tin tuy???n d???ng" />
          </Form.Item>
          <Form.Item>
            <Select onChange={handleChangeActive} defaultValue="">
              <Option value="">T???t c??? tin tuy???n d???ng</Option>
              <Option value="1">Tin ???? duy???t</Option>
              <Option value="0">Tin ch??a duy???t</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              T??m ki???m
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="list-employers">
        {data.length
          ? renderData()

          : <DataNull />}

        {data.length === 0 ? (
          ''
        ) : (
          <div className="custom-pagination">
            <Pagination
              onChange={handleChangePage}
              defaultCurrent={1}
              defaultPageSize={5}
              total={recruitmentbyuserid.total}
              current={current}
            />
          </div>
        )}
      </div>
    </div>
  )
}
export default ListJobEmployer

const bgColorChooser = ({ data }) => {
  if (data === 1) return '#D4EDDA'
  return '#f8d7db'
}
const textColorChooser = ({ data }) => {
  if (data === 1) return '#21c447'
  return '#dd4040'
}
const DivSucces = styled.section`
  background-color: ${bgColorChooser};
  width: 100%;
  border-radius: 10px;
`
const TextSucces = styled.span`
  color: ${textColorChooser};
`
